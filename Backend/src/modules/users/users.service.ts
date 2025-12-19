import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import {
  EquipmentRental,
  EquipmentRentalDocument,
} from '../equipment-Rental/schemas/equipment-rental.schema';
import { Booking, BookingDocument } from '../booking/schemas/booking.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(EquipmentRental.name)
    private rentalModel: Model<EquipmentRentalDocument>,
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Lấy thông tin profile của user
  async getProfile(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select(
        '-password -refreshToken -otp -otpExpiry -resetOtp -resetOtpExpiry',
      );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Cập nhật thông tin profile
  async updateProfile(
    userId: string,
    updateData: { fullName?: string; phone?: string },
  ) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { $set: updateData }, { new: true })
      .select(
        '-password -refreshToken -otp -otpExpiry -resetOtp -resetOtpExpiry',
      );

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Lấy thống kê dashboard cho user
  async getDashboardStats(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Lấy user info
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Convert userId to ObjectId for queries
    const userObjectId = new Types.ObjectId(userId);

    // ============ EQUIPMENT RENTAL ============
    // Đếm số lần thuê thiết bị trong tháng
    const rentalsThisMonth = await this.rentalModel.countDocuments({
      userId: userObjectId,
      rentalDate: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Đếm thiết bị đang thuê
    const activeRentals = await this.rentalModel.countDocuments({
      userId: userObjectId,
      status: 'renting',
    });

    // ============ BOOKING ============
    // Đếm số lần đặt sân trong tháng
    const bookingsThisMonth = await this.bookingModel.countDocuments({
      userId: userObjectId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Tính tổng chi tiêu trong tháng (Equipment + Booking)
    const [rentalSpending, bookingSpending] = await Promise.all([
      this.rentalModel.aggregate([
        {
          $match: {
            userId: userObjectId,
            rentalDate: { $gte: startOfMonth, $lte: endOfMonth },
            status: { $ne: 'cancelled' },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' },
          },
        },
      ]),
      this.bookingModel.aggregate([
        {
          $match: {
            userId: userObjectId,
            date: { $gte: startOfMonth, $lte: endOfMonth },
            paymentStatus: 'completed',
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' },
          },
        },
      ]),
    ]);

    const spendingThisMonth =
      (rentalSpending[0]?.total || 0) + (bookingSpending[0]?.total || 0);

    // ============ RECENT ACTIVITIES (GỘP BOOKING + RENTAL) ============
    // Lấy 5 hoạt động gần nhất từ Booking
    const recentBookings = (await this.bookingModel
      .find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('facilityId', 'name')
      .lean()
      .exec()) as any[];

    // Lấy 5 hoạt động gần nhất từ EquipmentRental
    const recentRentals = (await this.rentalModel
      .find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('equipmentId', 'name type')
      .lean()
      .exec()) as any[];

    // Gộp & sort theo createdAt, lấy 5 gần nhất
    const allActivities = [
      ...recentBookings.map((b) => ({
        id: b._id,
        type: 'booking',
        facility: b.facilityId,
        date: b.date,
        status: b.status,
        totalPrice: b.price,
        createdAt: b.createdAt,
      })),
      ...recentRentals.map((r) => ({
        id: r._id,
        type: 'equipment-rental',
        equipment: r.equipmentId,
        date: r.rentalDate,
        status: r.status,
        totalPrice: r.totalPrice,
        createdAt: r.createdAt,
      })),
    ]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);

    // ============ UPCOMING RENTALS ============
    // Lấy thiết bị đang thuê
    const upcomingRentals = await this.rentalModel
      .find({
        userId: userObjectId,
        status: 'renting',
      })
      .sort({ rentalDate: 1 })
      .limit(5)
      .populate('equipmentId', 'name type');

    return {
      fullName: user.fullName, // [UPDATED] Trả về tên user
      bookingsThisMonth: bookingsThisMonth + rentalsThisMonth,
      activeRentals,
      spendingThisMonth,
      penaltyPoints: user.penaltyPoints || 0,
      recentActivities: allActivities.map((a: any) => ({
        id: a.id,
        type: a.type,
        equipment: a.equipment || null,
        facility: a.facility || null,
        date: a.date,
        status: a.status,
        totalPrice: a.totalPrice,
      })),
      upcomingRentals: upcomingRentals.map((r) => ({
        id: r._id,
        equipment: r.equipmentId,
        date: r.rentalDate,
        duration: r.duration,
        status: r.status,
      })),
    };
  }
}
