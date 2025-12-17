import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import {
  EquipmentRental,
  EquipmentRentalDocument,
} from '../equipment-Rental/schemas/equipment-rental.schema';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(EquipmentRental.name)
    private rentalModel: Model<EquipmentRentalDocument>,
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

    // Tính tổng chi tiêu trong tháng
    const spendingResult = await this.rentalModel.aggregate([
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
    ]);
    const spendingThisMonth = spendingResult[0]?.total || 0;

    // Lấy các hoạt động gần đây (5 gần nhất)
    const recentActivities = await this.rentalModel
      .find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('equipmentId', 'name type');

    // Lấy lịch sắp tới (thiết bị đang thuê)
    const upcomingRentals = await this.rentalModel
      .find({
        userId: userObjectId,
        status: 'renting',
      })
      .sort({ rentalDate: 1 })
      .limit(5)
      .populate('equipmentId', 'name type');

    return {
      bookingsThisMonth: rentalsThisMonth,
      activeRentals,
      spendingThisMonth,
      penaltyPoints: user.penaltyPoints || 0,
      recentActivities: recentActivities.map((r) => ({
        id: r._id,
        type: 'equipment-rental',
        equipment: r.equipmentId,
        date: r.rentalDate,
        status: r.status,
        totalPrice: r.totalPrice,
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
