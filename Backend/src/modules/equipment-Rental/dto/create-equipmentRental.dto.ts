import {
  IsMongoId,
  IsNumber,
  Min,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateEquipmentRentalDto {
  @IsMongoId()
  userId: string;

  @IsMongoId()
  equipmentId: string;

  // số lượng item cần thuê
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsDateString()
  rentalDate?: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsOptional()
  @IsMongoId()
  paymentId?: string;
}
