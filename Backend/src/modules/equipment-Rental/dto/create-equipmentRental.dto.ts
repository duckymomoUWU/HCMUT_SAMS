import {
  IsMongoId,
  IsNumber,
  Min,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';

export class CreateEquipmentRentalDto {
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsMongoId()
  equipmentId: string;

  // Frontend gửi items array (optional, nếu không có thì tính từ quantity)
  @IsOptional()
  @IsArray()
  items?: string[];

  // số lượng item cần thuê (dùng nếu không có items)
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsDateString()
  rentalDate?: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsOptional()
  @IsNumber()
  totalPrice?: number;

  @IsOptional()
  @IsMongoId()
  paymentId?: string;
}
