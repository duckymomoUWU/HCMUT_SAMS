import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipmentRentalDto } from './create-equipmentRental.dto';

export class UpdateEquipmentRentalDto extends PartialType(CreateEquipmentRentalDto) {}
