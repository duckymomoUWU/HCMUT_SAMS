/* eslint-disable */
import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
  ForbiddenException,
  Logger, // Import Logger
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Types, Connection } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule'; // Import Cron
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PaymentCallbackDto } from './dto/payment-callback.dto';
import { Booking, BookingDocument, BookingStatus } from './schemas/booking.schema';
import { NotificationService } from '../notification/notification.service';
import { PaymentService } from '../payment/payment.service';
import { User, UserDocument } from '../auth/schemas/user.schema';
// import { PenaltyHistoryService } from '../penalty-history/penalty-history.service';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name); // Initialize Logger

  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly notificationService: NotificationService,
    // private readonly penaltyHistoryService: PenaltyHistoryService,
    private readonly paymentService: PaymentService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  // =========================================================================
  // CRON JOB for Expired Bookings
  // =========================================================================
  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredBookings() {
    this.logger.log('Running cron job to handle expired bookings...');
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    try {
      const result = await this.bookingModel.updateMany(
        {
          status: BookingStatus.PENDING_PAYMENT,
          createdAt: { $lt: fiveMinutesAgo },
        },
        {
          $set: { status: BookingStatus.EXPIRED },
        },
      );

      if (result.modifiedCount > 0) {
        this.logger.log(`Updated ${result.modifiedCount} booking(s) to EXPIRED.`);
      }
    } catch (error) {
      this.logger.error('Error running expired bookings cron job:', error);
    }
  }

  // =========================================================================
  // 1. Logic Tạo Đơn Đặt Sân (Giai đoạn 1)
  // =========================================================================
  async create(userId: string, ipAddr: string, createBookingDto: CreateBookingDto) {
    const { facilityId, bookingDate, slots } = createBookingDto;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }
    
    // --- Validation Checks ---
    const bookingDateObj = new Date(bookingDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setHours(0, 0, 0, 0);
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    if (bookingDateObj > thirtyDaysFromNow) {
      throw new BadRequestException('Chỉ có thể đặt lịch trong vòng 30 ngày tới.');
    }
    
    // --- Availability Check for all slots ---
    const statusesThatBlockBooking: BookingStatus[] = [
      BookingStatus.PENDING_PAYMENT,
      BookingStatus.CONFIRMED,
      BookingStatus.PAID,
      BookingStatus.CHECKED_IN,
    ];

    const orChecks = slots.map(slot => ({
      'slots': {
        $elemMatch: {
          startTime: { $lt: slot.endTime },
          endTime: { $gt: slot.startTime },
        }
      }
    }));

    const overlappingBooking = await this.bookingModel.findOne({
      facility: new Types.ObjectId(facilityId),
      bookingDate: new Date(bookingDate),
      status: { $in: statusesThatBlockBooking },
      $or: orChecks,
    });

    if (overlappingBooking) {
      throw new ConflictException('Một hoặc nhiều khung giờ bạn chọn đã bị đặt.');
    }
      
    // --- Create Booking Document ---
    const totalPrice = slots.reduce((sum, slot) => sum + slot.price, 0);

    const newBooking = new this.bookingModel({
      user: new Types.ObjectId(userId),
      facility: new Types.ObjectId(facilityId),
      bookingDate: new Date(bookingDate),
      slots: slots,
      totalPrice: totalPrice,
      status: BookingStatus.PENDING_PAYMENT,
      paymentMethod: 'VNPAY', // Or get from DTO if needed
    });
  
    await newBooking.save();
    
    // --- Call Payment Service ---
    const paymentResponse = await this.paymentService.createPayment({
        amount: newBooking.totalPrice,
        description: `Thanh toán cho đơn đặt sân ${newBooking._id.toString()}`,
        type: 'booking', // Use 'booking' type for the payment
        referenceId: newBooking._id.toString(),
    }, userId, ipAddr);
    
    return {
      bookingId: newBooking._id,
      paymentUrl: paymentResponse.payment.paymentUrl,
    };
  }

  // =========================================================================
  // 2. Logic Lấy Khung Giờ Trống (API hỗ trợ Frontend)
  // =========================================================================
  async getAvailableSlots(facilityId: string, date: string) {
    const startHour = 7;
    const endHour = 21;
    const allSlots: any[] = [];

    for (let i = startHour; i < endHour; i++) {
      const start = i.toString().padStart(2, '0') + ':00';
      const end = (i + 1).toString().padStart(2, '0') + ':00';
      allSlots.push({
        time: `${start} - ${end}`,
        start,
        end,
        price: 50000, // TODO: Lấy giá từ Facility Model
        status: 'available',
      });
    }
    
    const bookingsOnDate = await this.bookingModel.find({
        facility: new Types.ObjectId(facilityId),
        bookingDate: new Date(date),
        status: { 
            $nin: [BookingStatus.CANCELLED, BookingStatus.FAILED, BookingStatus.EXPIRED] 
        },
    }).select('slots').exec(); 

    const bookedTimeSlots = new Set<string>();
    bookingsOnDate.forEach(booking => {
      booking.slots.forEach(slot => {
        bookedTimeSlots.add(`${slot.startTime} - ${slot.endTime}`);
      });
    });

    return allSlots.map(slot => {
        if (bookedTimeSlots.has(slot.time)) {
            return { ...slot, status: 'booked' };
        }
        return slot;
    });
  }

  // =========================================================================
  // 3. Logic Xử lý Callback Thanh toán
  // =========================================================================
  async handlePaymentCallback(callbackDto: PaymentCallbackDto) {
    const { bookingId, status, txnRef } = callbackDto;

    const booking = await this.bookingModel.findById(bookingId);

    if (!booking) {
      throw new NotFoundException('Đơn đặt sân không tồn tại.');
    }

    if (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.FAILED) {
      console.log(`[CALLBACK] Booking ${bookingId} already processed. Status: ${booking.status}`);
      return { success: true, message: 'Giao dịch đã được xử lý trước đó.' };
    }

    if (booking.status !== BookingStatus.PENDING_PAYMENT) {
      throw new BadRequestException(`Đơn đặt sân ở trạng thái không hợp lệ: ${booking.status}`);
    }

    const userId = booking.user.toString();

    if (status === 'success') {
      booking.status = BookingStatus.CONFIRMED;
      booking.paymentTransactionId = txnRef || `DUMMY_${Date.now()}`;
      await booking.save();
      
      await this.notificationService.sendConfirmation(userId, bookingId);
      
      return { success: true, message: 'Thanh toán thành công và đã xác nhận đặt sân!' };
    } else {
      booking.status = BookingStatus.FAILED; 
      await booking.save();
      
      await this.notificationService.sendFailure(userId, bookingId);
      
      return { success: false, message: 'Thanh toán thất bại.' };
    }
  }
  
  // =========================================================================
  // 5. Logic Lấy Lịch sử Đặt Sân của User (API History)
  // =========================================================================
  async findUserBookings(userId: string, type: 'upcoming' | 'history' | 'all' = 'all') { 
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset về đầu ngày để so sánh

    const query: any = {
      user: new Types.ObjectId(userId),
    };
    
    if (type === 'upcoming') {
      // Lấy các đơn từ hôm nay trở đi và chưa bị hủy/lỗi
      query.bookingDate = { $gte: today };
      query.status = { $nin: [BookingStatus.CANCELLED, BookingStatus.FAILED] };
    } else if (type === 'history') {
      // Lấy các đơn trong quá khứ HOẶC các đơn đã hủy/lỗi/hoàn thành
      query.$or = [
        { bookingDate: { $lt: today } },
        { status: { $in: [BookingStatus.CANCELLED, BookingStatus.FAILED, /*BookingStatus.COMPLETED*/] } } // COMPLETED does not exist
      ];
    }

    return this.bookingModel
      .find(query)
      .sort({ bookingDate: -1, startTime: -1 }) // Sắp xếp mới nhất lên đầu
      .populate('user', 'fullName') // Populate thông tin người đặt
      .populate('facility', 'name location') // Populate thông tin sân
      .exec();
  }

  // =========================================================================
  // 6. Logic Hủy Đặt Sân
  // =========================================================================
  // =========================================================================
  // 6. Logic Hủy Đặt Sân
  // =========================================================================
  async cancelBooking(bookingId: string, cancellingUser: UserDocument) {
    const booking = await this.bookingModel.findById(bookingId).populate('user').exec();

    if (!booking) {
      throw new NotFoundException(`Đơn đặt sân với ID ${bookingId} không tồn tại.`);
    }

    const bookingOwner = booking.user as unknown as UserDocument;

    // A user can only cancel their own booking, unless they are an admin
    if (bookingOwner._id.toString() !== cancellingUser._id.toString() && cancellingUser.role !== 'admin') {
      throw new ForbiddenException('Bạn không có quyền hủy đơn đặt sân này.');
    }

    // --- Giai đoạn 1: Validation ---
    const now = new Date();
    
    // Find the earliest start time from the slots array
    if (!booking.slots || booking.slots.length === 0) {
      throw new InternalServerErrorException('Booking has no time slots.');
    }
    const earliestStartTime = booking.slots.reduce((earliest, current) => {
      return current.startTime < earliest ? current.startTime : earliest;
    }, booking.slots[0].startTime);

    const bookingStartTime = new Date(`${booking.bookingDate.toISOString().split('T')[0]}T${earliestStartTime}`);
    
    // Rule: Cannot cancel if the booking time has already passed
    if (now >= bookingStartTime) {
      throw new ForbiddenException('Không thể hủy vì đã quá thời gian đặt sân.');
    }

    // Rule: Check if the booking is in a cancellable state
    const cancellableStatuses: BookingStatus[] = [BookingStatus.CONFIRMED, BookingStatus.PAID];
    if (!cancellableStatuses.includes(booking.status)) {
      throw new BadRequestException(`Không thể hủy đơn đặt sân với trạng thái ${booking.status}.`);
    }

    // --- Giai đoạn 2: Xử lý Tài chính & Phạt ---
    const daysDiff = (bookingStartTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    let refundPercentage = 0;

    if (daysDiff > 3) {
      refundPercentage = 0.9;
    } else if (daysDiff >= 1) {
      refundPercentage = 0.7;
    } else {
      refundPercentage = 0.0;
    }

    const refundAmount = booking.totalPrice * refundPercentage;

    // Handle refund via mock payment service
    try {
      if (refundAmount > 0 && booking.paymentTransactionId) {
        console.log(`[INFO] Mock refund skipped. Real refund logic needed for amount: ${refundAmount}`);
      }
    } catch (error) {
      console.error(`[CRITICAL] Error during refund process for booking ${bookingId}:`, error);
    }
    
    // --- Giai đoạn 3: Cập nhật Trạng thái và Hậu cần ---
    booking.status = BookingStatus.CANCELLED;
    
    await booking.save();

    // Send confirmation notification
    await this.notificationService.sendCancellationConfirmation({
      userId: bookingOwner._id.toString(),
      bookingId: booking._id.toString(),
      refundAmount: refundAmount,
      penaltyPointsApplied: 0,
    });

    return {
      message: 'Đơn đặt sân đã được hủy thành công.',
      status: booking.status,
      refundAmount: refundAmount,
      penaltyPointsApplied: 0,
    };
  }
  
  // =========================================================================
  // 7. Các Hàm CRUD cơ bản (Cần sửa ID sang string)
  // =========================================================================
  async updateManyStatus(bookingIds: Types.ObjectId[], status: BookingStatus, session: any) {
    return this.bookingModel.updateMany(
      { _id: { $in: bookingIds } },
      { $set: { status: status } },
      { session: session }
    );
  }

  findAll() { return this.bookingModel.find().exec(); }

  async findOne(id: string) {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) { throw new NotFoundException(`Booking with ID ${id} not found`); }
    return booking;
  }

  // Hàm update (được dùng cho Admin hoặc thay đổi trạng thái)
  async update(id: string, updateBookingDto: UpdateBookingDto) { 
    const updatedBooking = await this.bookingModel
        .findByIdAndUpdate(id, updateBookingDto, { new: true })
        .exec();
    if (!updatedBooking) { throw new NotFoundException(`Booking with ID ${id} not found`); }
    return updatedBooking;
  }

  // Hàm remove/cancel
  async remove(id: string) { 
    const deletedBooking = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!deletedBooking) { throw new NotFoundException(`Booking with ID ${id} not found`); }
    return { message: `Booking with ID ${id} removed successfully.` };
  }

  // =========================================================================
  // 8. Logic Tạo lại Link Thanh toán
  // =========================================================================
  async repay(bookingId: string, userId: string, ipAddr: string) {
    const booking = await this.bookingModel.findById(bookingId);

    if (!booking) {
      throw new NotFoundException('Đơn đặt sân không tồn tại.');
    }

    if (booking.user.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền thực hiện hành động này.');
    }

    const repayableStatuses: BookingStatus[] = [
      BookingStatus.PENDING_PAYMENT,
      BookingStatus.FAILED,
      BookingStatus.EXPIRED,
    ];

    if (!repayableStatuses.includes(booking.status)) {
      throw new BadRequestException(`Không thể thanh toán lại cho đơn hàng với trạng thái ${booking.status}.`);
    }

    // Reset status to PENDING_PAYMENT to allow expiration logic to work again
    booking.status = BookingStatus.PENDING_PAYMENT;
    // We also need to update 'createdAt' to reset the 5-minute timer
    booking.createdAt = new Date();
    await booking.save();
    
    // Call Payment Service to get a new URL
    const paymentResponse = await this.paymentService.createPayment({
        amount: booking.totalPrice,
        description: `Thanh toán lại cho đơn đặt sân ${booking._id.toString()}`,
        type: 'booking',
        referenceId: booking._id.toString(),
    }, userId, ipAddr);
    
    return {
      bookingId: booking._id,
      paymentUrl: paymentResponse.payment.paymentUrl,
    };
  }
}
