import { IsOptional, IsString, IsEnum } from 'class-validator';
import { BookingStatus, PaymentStatus } from '../schemas/booking.schema';

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
}
