import { IsEnum } from 'class-validator';
import { EquipmentRentalStatus } from '../schemas/equipment-rental.schema';

export class UpdateEquipmentRentalDto {
  @IsEnum(EquipmentRentalStatus)
  status: EquipmentRentalStatus;
}
