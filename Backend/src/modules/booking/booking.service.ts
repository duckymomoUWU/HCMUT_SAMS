import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import {
  Booking,
  BookingDocument,
  BookingStatus,
  PaymentStatus,
} from './schemas/booking.schema';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  // ===============================
  // CREATE - TẠO BOOKING
  // ===============================
  async create(userId: string, createBookingDto: CreateBookingDto) {
    console.log('🔵 Creating booking:', { userId, ...createBookingDto });

    const { facilityId, facilityName, facilityLocation, date, timeSlot, price, notes } =
      createBookingDto;

    // Parse time slot: "07:00 - 08:00" -> startTime, endTime
    const [startTime, endTime] = timeSlot.split(' - ').map((t) => t.trim());

    // ✅ Validate: Không cho đặt sân vào thời gian quá khứ
    const bookingDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const bookingDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());

    // Nếu ngày đặt < hôm nay → reject
    if (bookingDay < today) {
      throw new BadRequestException('Không thể đặt sân vào ngày trong quá khứ');
    }

    // Nếu ngày đặt = hôm nay → check giờ
    if (bookingDay.getTime() === today.getTime()) {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const slotStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
      
      if (slotStartTime <= now) {
        throw new BadRequestException('Không thể đặt sân vào khung giờ đã qua');
      }
    }

    // Check xem slot đã được đặt chưa
    const existingBooking = await this.bookingModel.findOne({
      facilityId,
      date: new Date(date),
      timeSlot,
      status: { $nin: [BookingStatus.CANCELLED] },
    });

    if (existingBooking) {
      throw new ConflictException('Khung giờ này đã được đặt');
    }

    // Tạo booking
    const booking = new this.bookingModel({
      userId: new Types.ObjectId(userId),
      facilityId,
      facilityName: facilityName || 'Sân thể thao đa năng',
      facilityLocation: facilityLocation || 'Khu A - ĐHBK',
      date: new Date(date),
      timeSlot,
      startTime,
      endTime,
      price,
      notes,
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
    });

    const savedBooking = await booking.save();
    console.log('✅ Booking created:', savedBooking._id);

    return savedBooking;
  }

  // ===============================
  // GET MY BOOKINGS - LẤY BOOKING CỦA USER
  // ===============================
  async findByUser(userId: string) {
    console.log('🔵 Finding bookings for user:', userId);

    const bookings = await this.bookingModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();

    console.log('✅ Found bookings:', bookings.length);
    return bookings;
  }

  // ===============================
  // GET BY ID
  // ===============================
  async findOne(id: string) {
    const booking = await this.bookingModel.findById(id).exec();

    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking');
    }

    return booking;
  }

  // ===============================
  // GET ALL (ADMIN)
  // ===============================
  async findAll(query?: { status?: string; date?: string; facilityId?: string }) {
    const filter: any = {};

    if (query?.status) {
      filter.status = query.status;
    }
    if (query?.date) {
      filter.date = new Date(query.date);
    }
    if (query?.facilityId) {
      filter.facilityId = query.facilityId;
    }

    return this.bookingModel
      .find(filter)
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .exec();
  }

  // ===============================
  // GET BOOKED SLOTS
  // ===============================
  async getBookedSlots(facilityId: string, date: string): Promise<string[]> {
    const bookings = await this.bookingModel.find({
      facilityId,
      date: new Date(date),
      status: { $nin: [BookingStatus.CANCELLED] },
    });

    return bookings.map((b) => b.timeSlot);
  }

  // ===============================
  // UPDATE
  // ===============================
  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const booking = await this.bookingModel.findById(id);

    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking');
    }

    // Nếu cancel, thêm thời gian cancel
    if (updateBookingDto.status === BookingStatus.CANCELLED) {
      booking.cancelledAt = new Date();
    }

    Object.assign(booking, updateBookingDto);
    return booking.save();
  }

  // ===============================
  // UPDATE PAYMENT STATUS (Gọi từ Payment Service)
  // ===============================
  async updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus,
    paymentId?: string,
  ) {
    console.log('🔵 Updating booking payment status:', { id, paymentStatus, paymentId });

    const booking = await this.bookingModel.findById(id);

    if (!booking) {
      console.warn('⚠️ Booking not found:', id);
      return null;
    }

    booking.paymentStatus = paymentStatus;

    if (paymentStatus === PaymentStatus.PAID) {
      booking.status = BookingStatus.CONFIRMED;
    }

    if (paymentId) {
      booking.paymentId = new Types.ObjectId(paymentId);
    }

    const updated = await booking.save();
    console.log('✅ Booking updated:', { id, status: updated.status, paymentStatus: updated.paymentStatus });

    return updated;
  }

  // ===============================
  // CANCEL
  // ===============================
  async cancel(id: string, userId: string, reason?: string) {
    const booking = await this.bookingModel.findById(id);

    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking');
    }

    // Check ownership
    if (booking.userId.toString() !== userId) {
      throw new BadRequestException('Bạn không có quyền hủy booking này');
    }

    // Check if already cancelled/completed
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking đã được hủy');
    }
    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Không thể hủy booking đã hoàn thành');
    }

    // Check if can cancel (ít nhất 2 tiếng trước giờ đặt)
    const bookingDateTime = new Date(booking.date);
    const [hours, minutes] = booking.startTime.split(':').map(Number);
    bookingDateTime.setHours(hours, minutes, 0, 0);
    const now = new Date();
    const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilBooking < 2) {
      throw new BadRequestException('Không thể hủy booking trong vòng 2 tiếng trước giờ đặt');
    }

    booking.status = BookingStatus.CANCELLED;
    booking.cancelledAt = new Date();
    booking.cancelReason = reason;

    return booking.save();
  }

  // ===============================
  // CHECK-IN (Staff/Admin)
  // ===============================
  async checkin(id: string) {
    const booking = await this.bookingModel.findById(id);

    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking');
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Booking chưa được xác nhận');
    }

    booking.checkinTime = new Date();
    return booking.save();
  }

  // ===============================
  // CHECK-OUT (Staff/Admin)
  // ===============================
  async checkout(id: string) {
    const booking = await this.bookingModel.findById(id);

    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking');
    }

    if (!booking.checkinTime) {
      throw new BadRequestException('Chưa check-in');
    }

    booking.checkoutTime = new Date();
    booking.status = BookingStatus.COMPLETED;
    return booking.save();
  }
  // ===============================
  // GET STATS - THỐNG KÊ TỔNG HỢP (Aggregated Data)
  // ===============================
  async getBookingStats() {
    console.log('📊 Calculating integrated stats...');

    // 1. Thống kê từ Booking (Sân)
    const bookingStats = await this.bookingModel.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          confirmed: [
            { $match: { status: BookingStatus.CONFIRMED } },
            { $count: 'count' }
          ],
          pending: [
            { $match: { paymentStatus: PaymentStatus.UNPAID } },
            { $count: 'count' }
          ],
          revenue: [
            { $match: { paymentStatus: PaymentStatus.PAID } },
            { $group: { _id: null, total: { $sum: '$price' } } }
          ]
        }
      }
    ]);
    const bResult = bookingStats[0];

    return {
      totalBookings: bResult.total[0]?.count || 0,
      confirmedBookings: bResult.confirmed[0]?.count || 0,
      pendingBookings: bResult.pending[0]?.count || 0,
      totalRevenue: bResult.revenue[0]?.total || 0,
    };
  }
}
