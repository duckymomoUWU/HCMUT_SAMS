import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true, enum: ['booking', 'equipment-rental'] })
  type: string;

  @Prop({ required: true, type: Types.ObjectId })
  referenceId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'vnpay' })
  method: string; // ← Đổi default thành 'vnpay'

  @Prop({ 
    required: true,
    enum: ['pending', 'success', 'failed', 'cancelled'],
    default: 'pending' 
  })
  status: string;

  @Prop() // ← Mã giao dịch VNPay
  vnpayTransactionNo?: string;

  @Prop() // ← Mã phản hồi từ VNPay (00 = success)
  vnpayResponseCode?: string;

  @Prop() // ← Transaction ID do backend tạo (vnp_TxnRef)
  orderId: string;

  @Prop() // ← Bank code (nếu VNPay trả về)
  bankCode?: string;

  @Prop()
  description?: string;

  @Prop()
  paidAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);