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
import {
  EquipmentRental,
  EquipmentRentalDocument,
} from '../equipment-Rental/schemas/equipment-rental.schema';
import { EquipmentRentalStatus } from '../equipment-Rental/schemas/equipment-rental.schema';
import {
  Booking,
  BookingDocument,
  BookingStatus,
  PaymentStatus,
} from '../booking/schemas/booking.schema';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<PaymentDocument>,
    @InjectModel(EquipmentRental.name)
    private rentalModel: Model<EquipmentRentalDocument>,
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    private configService: ConfigService,
  ) {}

  // 1. TẠO PAYMENT VÀ VNPAY URL
  async createPayment(
    createPaymentDto: CreatePaymentDto,
    userId: string,
    ipAddr: string,
  ) {
    console.log('🔵 Creating payment:', {
      type: createPaymentDto.type,
      referenceId: createPaymentDto.referenceId,
      amount: createPaymentDto.amount,
      userId,
    });

    // Tạo order ID unique
    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Validate và convert referenceId nếu cần
    let referenceId: Types.ObjectId | string = createPaymentDto.referenceId;
    if (
      Types.ObjectId.isValid(createPaymentDto.referenceId) &&
      createPaymentDto.referenceId.length === 24
    ) {
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

    console.log('✅ Payment created in DB:', {
      id: payment._id,
      orderId: payment.orderId,
      type: payment.type,
    });

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
        createPaymentDto.description || `Thanh toan ${createPaymentDto.type}`,
      orderId: orderId,
      ipAddr: ipAddr || '127.0.0.1',
    });

    console.log('🔗 VNPay URL generated:', paymentUrl);

    return {
      success: true,
      message: 'Payment created successfully',
      payment: {
        id: payment._id,
        orderId: payment.orderId,
        amount: payment.amount,
        status: payment.status,
      },
      paymentUrl, // ← Frontend cần field này ở root level
    };
  }

  // 2. XỬ LÝ CALLBACK TỪ VNPAY
  async handleVNPayReturn(query: any) {
    console.log('🔵 VNPay callback received:', query);

    const hashSecret =
      this.configService.get<string>('VNPAY_HASH_SECRET') || '';

    // Verify chữ ký
    const { isValid, data } = VNPayHelper.verifyReturnUrl(query, hashSecret);

    if (!isValid) {
      console.error('❌ Invalid VNPay signature');
      throw new BadRequestException('Invalid signature');
    }

    // Tìm payment theo orderId
    const payment = await this.paymentModel.findOne({
      orderId: data.vnp_TxnRef,
    });

    if (!payment) {
      console.error('❌ Payment not found:', data.vnp_TxnRef);
      throw new NotFoundException('Payment not found');
    }

    console.log('✅ Payment found:', {
      id: payment._id,
      type: payment.type,
      referenceId: payment.referenceId,
    });

    // Kiểm tra response code từ VNPay
    const responseCode = data.vnp_ResponseCode;

    if (responseCode === '00') {
      // Thanh toán thành công
      payment.status = 'success';
      payment.paidAt = new Date();
      payment.vnpayTransactionNo = data.vnp_TransactionNo;
      payment.vnpayResponseCode = responseCode;
      payment.bankCode = data.vnp_BankCode;

      console.log('✅ Payment successful');

      // ✅ Xử lý cho EQUIPMENT RENTAL
      if (payment.type === 'equipment-rental' && payment.referenceId) {
        console.log('🔵 Updating rental status...');

        const updatedRental = await this.rentalModel.findByIdAndUpdate(
          payment.referenceId,
          {
            paymentId: payment._id,
            status: EquipmentRentalStatus.RENTING, // ← Chuyển sang "renting"
          },
          { new: true },
        );

        if (updatedRental) {
          console.log('✅ Rental updated:', {
            id: updatedRental._id,
            status: updatedRental.status,
            paymentId: updatedRental.paymentId,
          });
        } else {
          console.warn('⚠️ Rental not found:', payment.referenceId);
        }
      }

      // ✅ Xử lý cho BOOKING ĐẶT SÂN
      if (payment.type === 'booking' && payment.referenceId) {
        console.log('🔵 Updating booking status...');

        const updatedBooking = await this.bookingModel.findByIdAndUpdate(
          payment.referenceId,
          {
            paymentId: payment._id,
            paymentStatus: PaymentStatus.PAID,
            status: BookingStatus.CONFIRMED, // ← Chuyển sang "confirmed"
          },
          { new: true },
        );

        if (updatedBooking) {
          console.log('✅ Booking updated:', {
            id: updatedBooking._id,
            status: updatedBooking.status,
            paymentStatus: updatedBooking.paymentStatus,
            paymentId: updatedBooking.paymentId,
          });
        } else {
          console.warn('⚠️ Booking not found:', payment.referenceId);
        }
      }
    } else {
      // Thanh toán thất bại
      payment.status = 'failed';
      payment.vnpayResponseCode = responseCode;

      console.error('❌ Payment failed:', {
        responseCode,
        orderId: payment.orderId,
      });

      // Optional: Cancel rental if payment failed
      if (
        (payment.type === 'rental' || payment.type === 'equipment-rental') &&
        payment.referenceId
      ) {
        await this.rentalModel.findByIdAndUpdate(payment.referenceId, {
          status: EquipmentRentalStatus.CANCELLED,
        });
      }

      // Optional: Cancel booking if payment failed
      if (payment.type === 'booking' && payment.referenceId) {
        await this.bookingModel.findByIdAndUpdate(payment.referenceId, {
          status: BookingStatus.CANCELLED,
          paymentStatus: PaymentStatus.UNPAID,
        });
      }
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