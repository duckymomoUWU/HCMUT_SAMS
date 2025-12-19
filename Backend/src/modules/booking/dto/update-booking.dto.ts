import { IsOptional, IsString, IsEnum, IsDate } from 'class-validator';
import { BookingStatus, PaymentStatus } from '../schemas/booking.schema';
import { Type } from 'class-transformer';
export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  cancelReason?: string;

  @IsOptional()
  @Type(() => Date) // Chuyển đổi dữ liệu đầu vào thành đối tượng Date
  @IsDate()         // Kiểm tra xem có phải là ngày tháng hợp lệ không
  cancelledAt?: Date;
}
