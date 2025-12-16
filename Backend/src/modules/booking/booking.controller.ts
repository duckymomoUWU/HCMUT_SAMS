// Backend/src/modules/booking/booking.controller.ts
/* eslint-disable */
import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    Patch, 
    Param, 
    Delete, 
    UseGuards,
    Req,
    Query,
    BadRequestException,
    Redirect,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { PaymentCallbackDto } from './dto/payment-callback.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // 1. API Lấy khung giờ trống
  @Public()
  @Get('availability/:facilityId')
  async getFacilityAvailability(
    @Param('facilityId') facilityId: string,
    @Query('date') date: string,
  ) {
    if (!date) {
      throw new BadRequestException('Vui lòng cung cấp ngày đặt (date) hợp lệ.');
    }
    return this.bookingService.getAvailableSlots(facilityId, date);
  }

  // =========================================================================
  // 2. API POST Đặt sân (Hỗ trợ nhiều khung giờ)
  // =========================================================================
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const ipAddr = req.ip;
    return this.bookingService.create(userId, ipAddr, createBookingDto);
  }

  // =========================================================================
  // 3. API Lịch sử đặt sân
  // =========================================================================
  @UseGuards(JwtAuthGuard)
  @Get('history')
  async findUserHistory(
    @Req() req: any,
    @Query('type') type: 'upcoming' | 'history' | 'all' = 'all',
  ) {
    const userId = req.user.id; 
    return this.bookingService.findUserBookings(userId, type); 
  }

  // =========================================================================
  // 4. API Xử lý Callback Thanh toán
  // =========================================================================
  @Public()
  @Get('callback')
  @Redirect()
  async paymentCallback(@Query() callbackDto: PaymentCallbackDto) {
    const result = await this.bookingService.handlePaymentCallback(callbackDto);
    
    // Chuyển hướng đến trang frontend với trạng thái kết quả
    const redirectUrl = `http://localhost:5173/payment/result?status=${result.success ? 'success' : 'failed'}&bookingId=${callbackDto.bookingId}`;
    
    return {
      url: redirectUrl,
      statusCode: 302,
    };
  }
  
  // =========================================================================
  // 5. API Hủy đặt sân
  // =========================================================================
  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancelBooking(@Param('id') id: string, @Req() req: any) {
    const cancellingUser = req.user; 
    return this.bookingService.cancelBooking(id, cancellingUser);
  }

  // =========================================================================
  // 6. API Tạo lại Link thanh toán
  // =========================================================================
  @UseGuards(JwtAuthGuard)
  @Post(':id/repay')
  repayBooking(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    const ipAddr = req.ip;
    return this.bookingService.repay(id, userId, ipAddr);
  }

  // =========================================================================
  // 7. Các API CRUD cơ bản
  // =========================================================================
  
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id); 
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto); 
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id); 
  }
  
  @Get()
  findAll() {
    return this.bookingService.findAll();
  }
}