import {
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  Min,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class CreateEquipmentRentalDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  equipmentId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsDateString()
  rentalDate?: string;     // optional now

  @IsNumber()
  @Min(1)
  duration: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPrice?: number;     // optional: server sẽ override nếu có tính toán

  @IsEnum(['renting', 'cancelled', 'completed'])
  @IsOptional()
  status?: string;

  @IsMongoId()
  @IsOptional()
  paymentId?: string;
}
