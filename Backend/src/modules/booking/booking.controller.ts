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
@UseGuards(JwtAuthGuard, RolesGuard)
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

  // GET /booking - Lấy tất cả booking (Admin)
  @Get()
  @Roles('admin')
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
  @Roles('admin')
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
  @Roles('admin')
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
  @Roles('admin')
  async checkout(@Param('id') id: string) {
    const booking = await this.bookingService.checkout(id);
    return {
      success: true,
      message: 'Check-out thành công',
      booking,
    };
  }
}
