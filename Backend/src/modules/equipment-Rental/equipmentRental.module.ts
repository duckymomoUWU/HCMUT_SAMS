import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EquipmentRentalService } from './equipmentRental.service';
import { EquipmentRentalController } from './equipmentRental.controller';

import {
  EquipmentRental,
  EquipmentRentalSchema,
} from './schemas/equipment-rental.schema';

import {
  EquipmentItem,
  EquipmentItemSchema,
} from '../equipment-item/schemas/equipment-item.schema';

import {
  Equipment,
  EquipmentSchema,
} from '../equipment/schemas/equipment.schema';

import { EquipmentModule } from '../equipment/equipment.module';

@Module({
  imports: [
    EquipmentModule,
    MongooseModule.forFeature([
      { name: EquipmentRental.name, schema: EquipmentRentalSchema },
      { name: EquipmentItem.name, schema: EquipmentItemSchema },
      { name: Equipment.name, schema: EquipmentSchema },
    ]),
  ],
  controllers: [EquipmentRentalController],
  providers: [EquipmentRentalService],
  exports: [EquipmentRentalService, MongooseModule],
})
export class EquipmentRentalModule {}
