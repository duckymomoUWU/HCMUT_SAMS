import { IsString, IsNumber, IsOptional, Min, IsUrl } from 'class-validator';

export class CreateEquipmentDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  @Min(0)
  pricePerHour: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  // THÊM: Số lượng items ban đầu (optional)
  @IsOptional()
  @IsNumber()
  @Min(0)
  initialQuantity?: number;
}