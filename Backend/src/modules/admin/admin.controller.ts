import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { BookingService } from '../booking/booking.service';
import { EquipmentRentalService } from '../equipment-Rental/equipmentRental.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { BookingStatus } from '../booking/schemas/booking.schema';
import { EquipmentRentalStatus } from '../equipment-Rental/schemas/equipment-rental.schema';
@Controller('admin')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly bookingService: BookingService,
    private readonly rentalService: EquipmentRentalService,
  ) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }

  // GET /admin/booking-stats - Thống kê booking cho admin
  @Get('booking-stats')
  async getBookingStats() {
    const stats = await this.adminService.getBookingStats();
    return {
      success: true,
      stats,
    };
  }

  // GET /admin/bookings - Danh sách tổng quát đơn hàng
  @Get('bookings')
  async getBookings() {
    const bookings = await this.adminService.getAllBookings();
    return {
      success: true,
      bookings,
    };
  }

  // PATCH /admin/bookings/:id - Xác nhận đơn
  @Patch('bookings/:id')
  async updateBooking(@Param('id') id: string, @Body() updateData: any) {
    const booking = await this.bookingService.update(id, updateData);
    return {
      success: true,
      message: 'Cập nhật booking thành công',
      booking,
    };
  }

  // PATCH /admin/bookings/:id/cancel - Hủy đơn
  @Patch('bookings/:id/cancel')
  async cancelBooking(@Param('id') id: string, @Body('reason') reason?: string) {
    // For admin cancel, we can cancel without ownership check
    const booking = await this.bookingService.update(id, {
      status: BookingStatus.CANCELLED,
      cancelReason: reason,
    });
    return {
      success: true,
      message: 'Hủy booking thành công',
      booking,
    };
  }

  // PATCH /admin/bookings/:id/checkin - Check-in
  @Patch('bookings/:id/checkin')
  async checkinBooking(@Param('id') id: string) {
    const booking = await this.bookingService.checkin(id);
    return {
      success: true,
      message: 'Check-in thành công',
      booking,
    };
  }

  // GET /admin/rentals - Danh sách rentals
  @Get('rentals')
  async getRentals(@Query('status') status?: string) {
    const rentals = await this.rentalService.findAll();
    let filtered = rentals;
    if (status) {
      filtered = rentals.filter(r => r.status === status);
    }
    return {
      success: true,
      rentals: filtered,
    };
  }

  // PATCH /admin/rentals/:id/status - Cập nhật trạng thái rental
  @Patch('rentals/:id/status')
  async updateRentalStatus(@Param('id') id: string, @Body('status') status: EquipmentRentalStatus) {
    const rental = await this.rentalService.updateStatus(id, status);
    return {
      success: true,
      message: 'Cập nhật trạng thái thành công',
      rental,
    };
  }
}
