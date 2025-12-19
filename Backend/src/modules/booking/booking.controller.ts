import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // POST /booking - Tạo booking mới
  @Post()
  async create(@Req() req, @Body() createBookingDto: CreateBookingDto) {
    console.log('🔵 POST /booking - userId:', req.user?.userId);
    const booking = await this.bookingService.create(
      req.user.userId,
      createBookingDto,
    );
    return {
      success: true,
      message: 'Tạo booking thành công',
      booking,
    };
  }

  // GET /booking/my-bookings - Lấy booking của user hiện tại
  @Get('my-bookings')
  async getMyBookings(@Req() req) {
    console.log('🔵 GET /booking/my-bookings - userId:', req.user?.userId);
    const bookings = await this.bookingService.findByUser(req.user.userId);
    return {
      success: true,
      bookings,
    };
  }

  // GET /booking/booked-slots - Lấy các slot đã đặt
  @Get('booked-slots')
  async getBookedSlots(
    @Query('facilityId') facilityId: string,
    @Query('date') date: string,
  ) {
    const slots = await this.bookingService.getBookedSlots(facilityId, date);
    return {
      success: true,
      bookedSlots: slots,
    };
  }

  // ========================================
  // ADMIN: QUẢN LÝ KHUNG GIỜ
  // ========================================

  // GET /booking/admin/facilities - Lấy danh sách sân từ bookings
  @Get('admin/facilities')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getUniqueFacilities() {
    const facilities = await this.bookingService.getUniqueFacilities();
    return {
      success: true,
      facilities,
    };
  }

  // GET /booking/admin/time-slots - Chức năng 1: Xem danh sách khung giờ theo ngày
  @Get('admin/time-slots')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getTimeSlots(
    @Query('facilityId') facilityId: string,
    @Query('date') date: string,
  ) {
    const slots = await this.bookingService.getTimeSlotsForDay(facilityId, date);
    return {
      success: true,
      slots,
    };
  }

  // GET /booking/admin/time-slots/stats - Chức năng 2: Xem thống kê khung giờ
  @Get('admin/time-slots/stats')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getTimeSlotStats(
    @Query('facilityId') facilityId: string,
    @Query('date') date: string,
  ) {
    const stats = await this.bookingService.getTimeSlotStats(facilityId, date);
    return {
      success: true,
      stats,
    };
  }

  // POST /booking/admin/time-slots/lock - Chức năng 3: Khóa khung giờ
  @Post('admin/time-slots/lock')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async lockTimeSlot(
    @Body() body: { facilityId: string; date: string; timeSlot: string; reason?: string },
  ) {
    const result = await this.bookingService.lockTimeSlot(
      body.facilityId,
      body.date,
      body.timeSlot,
      body.reason,
    );
    return {
      success: true,
      message: 'Khóa khung giờ thành công',
      booking: result,
    };
  }

  // POST /booking/admin/time-slots/unlock - Chức năng 3: Mở khóa khung giờ
  @Post('admin/time-slots/unlock')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async unlockTimeSlot(
    @Body() body: { facilityId: string; date: string; timeSlot: string },
  ) {
    const result = await this.bookingService.unlockTimeSlot(
      body.facilityId,
      body.date,
      body.timeSlot,
    );
    return {
      success: true,
      message: 'Mở khóa khung giờ thành công',
    };
  }

  // PATCH /booking/admin/time-slots/:id/price - Chức năng 4: Thay đổi giá
  @Patch('admin/time-slots/:id/price')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateSlotPrice(
    @Param('id') id: string,
    @Body('price') price: number,
  ) {
    const booking = await this.bookingService.updateSlotPrice(id, price);
    return {
      success: true,
      message: 'Cập nhật giá thành công',
      booking,
    };
  }

  // POST /booking/admin/time-slots/lock-multiple - Chức năng 5: Khóa nhiều slot
  @Post('admin/time-slots/lock-multiple')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async lockMultipleSlots(
    @Body() body: { facilityId: string; date: string; timeSlots: string[]; reason?: string },
  ) {
    const results = await this.bookingService.lockMultipleSlots(
      body.facilityId,
      body.date,
      body.timeSlots,
      body.reason,
    );
    return {
      success: true,
      message: 'Xử lý xong',
      results,
    };
  }

  // GET /booking/admin/time-slots/week - Lấy khung giờ theo tuần
  @Get('admin/time-slots/week')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getTimeSlotsForWeek(
    @Query('facilityId') facilityId: string,
    @Query('startDate') startDate: string,
  ) {
    const slots = await this.bookingService.getTimeSlotsForWeek(facilityId, startDate);
    return {
      success: true,
      slots,
    };
  }

  // GET /booking/admin/time-slots/month - Lấy khung giờ theo tháng
  @Get('admin/time-slots/month')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getTimeSlotsForMonth(
    @Query('facilityId') facilityId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const slots = await this.bookingService.getTimeSlotsForMonth(
      facilityId,
      parseInt(year),
      parseInt(month),
    );
    return {
      success: true,
      slots,
    };
  }

  // ========================================
  // EXISTING ENDPOINTS
  // ========================================

  // GET /booking - Lấy tất cả booking (Admin)
  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('facilityId') facilityId?: string,
  ) {
    const bookings = await this.bookingService.findAll({
      status,
      date,
      facilityId,
    });
    return {
      success: true,
      bookings,
    };
  }

  // GET /booking/:id - Lấy booking theo ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const booking = await this.bookingService.findOne(id);
    return {
      success: true,
      booking,
    };
  }

  // PATCH /booking/:id - Cập nhật booking
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    const booking = await this.bookingService.update(id, updateBookingDto);
    return {
      success: true,
      message: 'Cập nhật booking thành công',
      booking,
    };
  }

  // PATCH /booking/:id/cancel - Hủy booking
  @Patch(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Req() req,
    @Body('reason') reason?: string,
  ) {
    const booking = await this.bookingService.cancel(
      id,
      req.user.userId,
      reason,
    );
    return {
      success: true,
      message: 'Hủy booking thành công',
      booking,
    };
  }

  // PATCH /booking/:id/checkin - Check-in (Staff/Admin)
  @Patch(':id/checkin')
  async checkin(@Param('id') id: string) {
    const booking = await this.bookingService.checkin(id);
    return {
      success: true,
      message: 'Check-in thành công',
      booking,
    };
  }

  // PATCH /booking/:id/checkout - Check-out (Staff/Admin)
  @Patch(':id/checkout')
  async checkout(@Param('id') id: string) {
    const booking = await this.bookingService.checkout(id);
    return {
      success: true,
      message: 'Check-out thành công',
      booking,
    };
  }
}
