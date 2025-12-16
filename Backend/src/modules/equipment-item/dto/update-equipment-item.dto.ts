import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipmentItemDto } from './create-equipment-item.dto';

export class UpdateEquipmentItemDto extends PartialType(
  CreateEquipmentItemDto,
) {}
