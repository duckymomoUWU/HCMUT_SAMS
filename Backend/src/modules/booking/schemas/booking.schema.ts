// Backend/src/modules/booking/schemas/booking.schema.ts
/* eslint-disable */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

// Các trạng thái của đơn đặt sân
export enum BookingStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT', // Chờ thanh toán
  CONFIRMED = 'CONFIRMED',    // Thanh toán thành công, Booking chính thức
  PAID = 'PAID',              // (Có thể dùng CONFIRMED thay thế, nhưng giữ lại cho rõ ràng)
  CANCELLED = 'CANCELLED',    // Bị hủy bởi người dùng hoặc hệ thống
  FAILED = 'FAILED',          // Thanh toán thất bại
  COMPLETED = 'COMPLETED',    // Đã hoàn thành sau khi kết thúc giờ thuê
  CHECKED_IN = 'CHECKED_IN',
  EXPIRED = 'EXPIRED',        // Hết hạn thanh toán
}

@Schema({ _id: false }) // Define sub-document schema without an _id
export class Slot {
  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;

  @Prop({ required: true })
  price: number;
}
const SlotSchema = SchemaFactory.createForClass(Slot);

@Schema({ timestamps: true })
export class Booking {
  _id: Types.ObjectId; // Explicitly define _id
  // Liên kết với người dùng (Tiền điều kiện 1)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  // Liên kết với sân/phòng tập (Tiền điều kiện 2)
  @Prop({ type: Types.ObjectId, ref: 'Facility', required: true })
  facility: Types.ObjectId;

  // Ngày đặt
  @Prop({ required: true })
  bookingDate: Date;

  // Mảng các khung giờ được đặt
  @Prop({ type: [SlotSchema], required: true })
  slots: Slot[];

  // Tổng chi phí
  @Prop({ required: true, min: 0 })
  totalPrice: number; 

  // Phương thức thanh toán
  @Prop({ required: true })
  paymentMethod: string; 

  // Trạng thái đơn đặt (Mặc định là PENDING_PAYMENT)
  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.PENDING_PAYMENT })
  status: BookingStatus;
  
  // ID giao dịch từ cổng thanh toán (sẽ được cập nhật sau)
  @Prop()
  paymentTransactionId: string; 

  createdAt: Date;
  updatedAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// TTL index is removed in favor of the cron job in BookingService.
