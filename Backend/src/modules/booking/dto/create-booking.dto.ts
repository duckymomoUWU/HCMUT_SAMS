import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({ message: 'Facility ID là bắt buộc' })
  @IsString()
  facilityId: string;

  @IsOptional()
  @IsString()
  facilityName?: string;

  @IsOptional()
  @IsString()
  facilityLocation?: string;

  @IsNotEmpty({ message: 'Ngày đặt là bắt buộc' })
  @IsDateString()
  date: string;

  @IsNotEmpty({ message: 'Khung giờ là bắt buộc' })
  @IsString()
  timeSlot: string; // "07:00 - 08:00"

  @IsNotEmpty({ message: 'Giá là bắt buộc' })
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
