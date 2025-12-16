import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EquipmentItemService } from './equipment-item.service';
import { EquipmentItemController } from './equipment-item.controller';
import {
  EquipmentItem,
  EquipmentItemSchema,
} from './schemas/equipment-item.schema';
import {
  Equipment,
  EquipmentSchema,
} from '../equipment/schemas/equipment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EquipmentItem.name, schema: EquipmentItemSchema },
      { name: Equipment.name, schema: EquipmentSchema },
    ]),
  ],
  controllers: [EquipmentItemController],
  providers: [EquipmentItemService],
  exports: [EquipmentItemService],
})
export class EquipmentItemModule {}
