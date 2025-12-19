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

// Danh sách khung giờ cố định trong ngày
const TIME_SLOTS = [
  '07:00 - 08:00',
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
  '21:00 - 22:00',
];

// Giá mặc định mỗi slot
const DEFAULT_SLOT_PRICE = 100000;

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
  // GET UNIQUE FACILITIES (từ bookings)
  // ===============================
  async getUniqueFacilities() {
    const facilities = await this.bookingModel.aggregate([
      {
        $group: {
          _id: '$facilityId',
          facilityName: { $first: '$facilityName' },
          facilityLocation: { $first: '$facilityLocation' },
        },
      },
      {
        $project: {
          _id: 0,
          id: '$_id',
          name: '$facilityName',
          location: '$facilityLocation',
        },
      },
    ]);

    return facilities;
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

    return this.bookingModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  // ===============================
  // GET BOOKED SLOTS
  // ===============================
  async getBookedSlots(facilityId: string, date: string): Promise<{ time: string; status: string }[]> {
    const bookings = await this.bookingModel.find({
      facilityId,
      date: new Date(date),
      status: { $nin: [BookingStatus.CANCELLED] },
    });

    return bookings.map((b) => ({
      time: b.timeSlot,
      status: b.status === BookingStatus.LOCKED ? 'locked' : 'booked',
    }));
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

    // Optional: Check if can cancel (ít nhất 2 tiếng trước giờ đặt)
    // const bookingDateTime = new Date(booking.date);
    // const [hours] = booking.startTime.split(':');
    // bookingDateTime.setHours(parseInt(hours), 0, 0, 0);
    // const now = new Date();
    // const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    // if (hoursUntilBooking < 2) {
    //   throw new BadRequestException('Không thể hủy booking trong vòng 2 tiếng trước giờ đặt');
    // }

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
  // ADMIN: QUẢN LÝ KHUNG GIỜ
  // ===============================

  /**
   * Chức năng 1: Xem danh sách khung giờ theo ngày
   * Trả về tất cả slots trong ngày với trạng thái (trống/đã đặt/đã khóa)
   */
  async getTimeSlotsForDay(facilityId: string, date: string) {
    const bookings = await this.bookingModel.find({
      facilityId,
      date: new Date(date),
      status: { $nin: [BookingStatus.CANCELLED] },
    }).populate('userId', 'fullName email');

    // Map bookings theo timeSlot
    const bookingMap = new Map<string, any>();
    bookings.forEach(b => {
      bookingMap.set(b.timeSlot, b);
    });

    // Tạo danh sách tất cả slots
    const slots = TIME_SLOTS.map(timeSlot => {
      const booking = bookingMap.get(timeSlot);
      const [startTime, endTime] = timeSlot.split(' - ');
      
      if (booking) {
        return {
          timeSlot,
          startTime,
          endTime,
          status: booking.status === BookingStatus.LOCKED ? 'locked' : 'booked',
          price: booking.price,
          booking: {
            _id: booking._id,
            userId: booking.userId,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            notes: booking.notes,
          },
        };
      }
      
      return {
        timeSlot,
        startTime,
        endTime,
        status: 'available',
        price: DEFAULT_SLOT_PRICE,
        booking: null,
      };
    });

    return slots;
  }

  /**
   * Chức năng 2: Xem thống kê khung giờ
   */
  async getTimeSlotStats(facilityId: string, date: string) {
    const bookings = await this.bookingModel.find({
      facilityId,
      date: new Date(date),
      status: { $nin: [BookingStatus.CANCELLED] },
    });

    const bookedCount = bookings.filter(b => b.status !== BookingStatus.LOCKED).length;
    const lockedCount = bookings.filter(b => b.status === BookingStatus.LOCKED).length;

    return {
      total: TIME_SLOTS.length,
      booked: bookedCount,
      available: TIME_SLOTS.length - bookedCount - lockedCount,
      locked: lockedCount,
    };
  }

  /**
   * Chức năng 3: Khóa khung giờ (Admin tạo booking với status = locked)
   */
  async lockTimeSlot(
    facilityId: string,
    date: string,
    timeSlot: string,
    reason?: string,
  ) {
    // Check xem slot đã có booking chưa
    const existingBooking = await this.bookingModel.findOne({
      facilityId,
      date: new Date(date),
      timeSlot,
      status: { $nin: [BookingStatus.CANCELLED] },
    });

    if (existingBooking) {
      throw new ConflictException('Khung giờ này đã được đặt hoặc đã khóa');
    }

    // Parse time slot
    const [startTime, endTime] = timeSlot.split(' - ').map(t => t.trim());

    // Tạo booking với status = locked (dùng để đánh dấu khóa)
    const lockedBooking = new this.bookingModel({
      userId: new Types.ObjectId('000000000000000000000000'), // Admin placeholder
      facilityId,
      facilityName: 'Sân thể thao',
      facilityLocation: 'Khu A - ĐHBK',
      date: new Date(date),
      timeSlot,
      startTime,
      endTime,
      price: 0,
      status: BookingStatus.LOCKED, // Trạng thái khóa
      paymentStatus: PaymentStatus.UNPAID,
      notes: reason || 'Khóa bởi Admin',
    });

    return lockedBooking.save();
  }

  /**
   * Chức năng 3: Mở khóa khung giờ
   */
  async unlockTimeSlot(facilityId: string, date: string, timeSlot: string) {
    const booking = await this.bookingModel.findOne({
      facilityId,
      date: new Date(date),
      timeSlot,
      status: BookingStatus.LOCKED,
    });

    if (!booking) {
      throw new NotFoundException('Không tìm thấy khung giờ bị khóa');
    }

    // Xóa booking (unlock = xóa record khóa)
    await this.bookingModel.deleteOne({ _id: booking._id });

    return { message: 'Đã mở khóa khung giờ' };
  }

  /**
   * Chức năng 4: Thay đổi giá khung giờ (cập nhật booking)
   */
  async updateSlotPrice(bookingId: string, newPrice: number) {
    const booking = await this.bookingModel.findById(bookingId);

    if (!booking) {
      throw new NotFoundException('Không tìm thấy booking');
    }

    booking.price = newPrice;
    return booking.save();
  }

  /**
   * Chức năng 5: Tạo bulk bookings/slots cho ngày (Admin đặt trước các slot)
   * Thực tế: Hệ thống này không cần tạo bulk vì slots được tính toán động
   * Nhưng có thể dùng để khóa nhiều slot cùng lúc
   */
  async lockMultipleSlots(
    facilityId: string,
    date: string,
    timeSlots: string[],
    reason?: string,
  ) {
    const results: { timeSlot: string; success: boolean; booking?: any; error?: string }[] = [];
    
    for (const timeSlot of timeSlots) {
      try {
        const locked = await this.lockTimeSlot(facilityId, date, timeSlot, reason);
        results.push({ timeSlot, success: true, booking: locked });
      } catch (error) {
        results.push({ timeSlot, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Lấy khung giờ theo tuần
   */
  async getTimeSlotsForWeek(facilityId: string, startDate: string) {
    const start = new Date(startDate);
    const results: { date: string; dayOfWeek: string; total: number; booked: number; available: number; locked: number }[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      const stats = await this.getTimeSlotStats(facilityId, dateStr);
      results.push({
        date: dateStr,
        dayOfWeek: currentDate.toLocaleDateString('vi-VN', { weekday: 'short' }),
        ...stats,
      });
    }

    return results;
  }

  /**
   * Lấy khung giờ theo tháng
   */
  async getTimeSlotsForMonth(facilityId: string, year: number, month: number) {
    const daysInMonth = new Date(year, month, 0).getDate();
    const results: { date: string; day: number; total: number; booked: number; available: number; locked: number }[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const stats = await this.getTimeSlotStats(facilityId, dateStr);
      results.push({
        date: dateStr,
        day,
        ...stats,
      });
    }

    return results;
  }
}
