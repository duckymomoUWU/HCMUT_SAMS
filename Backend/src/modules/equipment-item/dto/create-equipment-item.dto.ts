import { IsMongoId, IsEnum, IsOptional, IsString } from 'class-validator';
import { EquipmentItemStatus } from '../schemas/equipment-item.schema';

export class CreateEquipmentItemDto {
  @IsMongoId()
  equipmentId: string;

  @IsEnum(EquipmentItemStatus)
  @IsOptional()
  status?: EquipmentItemStatus;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
