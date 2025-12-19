import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookingDocument = Booking & Document;

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  LOCKED = 'locked', // Admin khóa khung giờ
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

@Schema({ timestamps: true })
export class Booking {
  // Người đặt sân
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // Sân được đặt (tạm thời dùng string, sau có thể link Facility)
  @Prop({ required: true })
  facilityId: string;

  // Tên sân (để hiển thị)
  @Prop({ default: 'Sân thể thao đa năng' })
  facilityName: string;

  // Vị trí sân
  @Prop({ default: 'Khu A - ĐHBK' })
  facilityLocation: string;

  // Ngày đặt sân
  @Prop({ required: true })
  date: Date;

  // Khung giờ: "07:00 - 08:00"
  @Prop({ required: true })
  timeSlot: string;

  // Giờ bắt đầu: "07:00"
  @Prop({ required: true })
  startTime: string;

  // Giờ kết thúc: "08:00"
  @Prop({ required: true })
  endTime: string;

  // Giá tiền
  @Prop({ required: true, min: 0 })
  price: number;

  // Trạng thái booking
  @Prop({
    enum: Object.values(BookingStatus),
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  // Trạng thái thanh toán
  @Prop({
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.UNPAID,
  })
  paymentStatus: PaymentStatus;

  // Link đến Payment (sau khi thanh toán)
  @Prop({ type: Types.ObjectId, ref: 'Payment' })
  paymentId?: Types.ObjectId;

  // Thời gian check-in
  @Prop()
  checkinTime?: Date;

  // Thời gian check-out
  @Prop()
  checkoutTime?: Date;

  // Ghi chú
  @Prop()
  notes?: string;

  // Thời gian hủy
  @Prop()
  cancelledAt?: Date;

  // Lý do hủy
  @Prop()
  cancelReason?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Index để tìm kiếm nhanh
BookingSchema.index({ userId: 1, date: -1 });
BookingSchema.index({ facilityId: 1, date: 1, timeSlot: 1 });
