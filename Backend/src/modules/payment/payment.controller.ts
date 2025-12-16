import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // API 1: Tạo payment mới
  // POST /payment
  @UseGuards(JwtAuthGuard)
  @Post()
  createPayment(@Body() createPaymentDto: CreatePaymentDto, @Req() req) {
    const userId = req.user.userId || req.user.sub || req.user._id;
    const ipAddr = req.ip || req.connection.remoteAddress;

    return this.paymentService.createPayment(createPaymentDto, userId, ipAddr);
  }

  // API 2: VNPay callback (Public - không cần auth)
  // GET /payment/vnpay-return?vnp_xxx=xxx&vnp_yyy=yyy...
  @Public()
  @Get('vnpay-return')
  async vnpayReturn(@Query() query: any, @Res() res: Response) {
    try {
      const result = await this.paymentService.handleVNPayReturn(query);

      // Redirect về frontend với kết quả
      const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:5173';
      const redirectUrl = `${frontendUrl}/payment/result?success=${result.success}&paymentId=${result.payment.id}`;

      return res.redirect(redirectUrl);
    } catch (error) {
      const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:5173';
      return res.redirect(
        `${frontendUrl}/payment/result?success=false&error=${error.message}`,
      );
    }
  }

  // API 3: Lấy thông tin payment
  // GET /payment/:id
  @Get(':id')
  getPaymentById(@Param('id') id: string) {
    return this.paymentService.getPaymentById(id);
  }

  // API 4: Lấy payments của user
  // GET /payment/user/me
  @Get('user/me')
  getUserPayments(@Req() req) {
    const userId = req.user.userId;
    return this.paymentService.getUserPayments(userId);
  }
}
