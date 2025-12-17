import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { Equipment, EquipmentSchema } from './schemas/equipment.schema';
import {
  EquipmentItem,
  EquipmentItemSchema,
} from '../equipment-item/schemas/equipment-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Equipment.name, schema: EquipmentSchema },
      { name: EquipmentItem.name, schema: EquipmentItemSchema }, // ✅ PHẢI CÓ!
    ]),
  ],
  controllers: [EquipmentController],
  providers: [EquipmentService],
  exports: [EquipmentService, MongooseModule],
})
export class EquipmentModule {}