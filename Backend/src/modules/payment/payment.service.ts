import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment, PaymentDocument } from './entities/payment.entity';
import { VNPayHelper } from './vnpay.helper';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
    private configService: ConfigService, // ← Inject ConfigService
  ) {}

  // 1. TẠO PAYMENT VÀ VNPAY URL
  async createPayment(
    createPaymentDto: CreatePaymentDto,
    userId: string,
    ipAddr: string, // IP của user (cần cho VNPay)
  ) {
    // Tạo order ID unique
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Validate và convert referenceId nếu cần
    let referenceId: Types.ObjectId | string = createPaymentDto.referenceId;
    // Chỉ convert sang ObjectId nếu là valid ObjectId string (24 hex characters)
    if (Types.ObjectId.isValid(createPaymentDto.referenceId) && 
        createPaymentDto.referenceId.length === 24) {
      referenceId = new Types.ObjectId(createPaymentDto.referenceId);
    }

    // Validate userId
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    // Tạo payment record trong DB
    const payment = new this.paymentModel({
      ...createPaymentDto,
      referenceId: referenceId,
      userId: new Types.ObjectId(userId),
      method: 'vnpay',
      status: 'pending',
      orderId,
    });

    await payment.save();

    // Lấy config VNPay từ .env
    const vnpayConfig = {
      tmnCode: this.configService.get<string>('VNPAY_TMN_CODE') || '',
      hashSecret: this.configService.get<string>('VNPAY_HASH_SECRET') || '',
      url: this.configService.get<string>('VNPAY_URL') || '',
      returnUrl: this.configService.get<string>('VNPAY_RETURN_URL') || '',
    };

    // Tạo VNPay URL
    const paymentUrl = VNPayHelper.createPaymentUrl(vnpayConfig, {
      amount: createPaymentDto.amount,
      orderInfo:
        createPaymentDto.description || `Thanh toán ${createPaymentDto.type}`,
      orderId: orderId,
      ipAddr: ipAddr || '127.0.0.1',
    });

    return {
      success: true,
      message: 'Payment created successfully',
      payment: {
        id: payment._id,
        orderId: payment.orderId,
        amount: payment.amount,
        status: payment.status,
        paymentUrl, // ← URL để redirect user sang VNPay
      },
    };
  }

  // 2. XỬ LÝ CALLBACK TỪ VNPAY
  async handleVNPayReturn(query: any) {
    const hashSecret = this.configService.get<string>('VNPAY_HASH_SECRET') || '';

    // Verify chữ ký
    const { isValid, data } = VNPayHelper.verifyReturnUrl(query, hashSecret);

    if (!isValid) {
      throw new BadRequestException('Invalid signature');
    }

    // Tìm payment theo orderId
    const payment = await this.paymentModel.findOne({
      orderId: data.vnp_TxnRef,
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Kiểm tra response code từ VNPay
    const responseCode = data.vnp_ResponseCode;

    if (responseCode === '00') {
      // Thanh toán thành công
      payment.status = 'success';
      payment.paidAt = new Date();
      payment.vnpayTransactionNo = data.vnp_TransactionNo;
      payment.vnpayResponseCode = responseCode;
      payment.bankCode = data.vnp_BankCode;
    } else {
      // Thanh toán thất bại
      payment.status = 'failed';
      payment.vnpayResponseCode = responseCode;
    }

    await payment.save();

    return {
      success: payment.status === 'success',
      message:
        payment.status === 'success' ? 'Payment successful' : 'Payment failed',
      payment: {
        id: payment._id,
        orderId: payment.orderId,
        status: payment.status,
        amount: payment.amount,
        type: payment.type,
        referenceId: payment.referenceId,
        responseCode,
      },
    };
  }

  // 3. LẤY THÔNG TIN PAYMENT
  async getPaymentById(paymentId: string) {
    const payment = await this.paymentModel
      .findById(paymentId)
      .populate('userId', 'fullName email');

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return {
      success: true,
      payment,
    };
  }

  // 4. LẤY PAYMENTS CỦA USER
  async getUserPayments(userId: string) {
    const payments = await this.paymentModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 });

    return {
      success: true,
      count: payments.length,
      payments,
    };
  }
}
