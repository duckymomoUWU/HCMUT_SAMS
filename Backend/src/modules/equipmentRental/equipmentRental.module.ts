import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EquipmentRentalService } from './equipmentRental.service';
import { EquipmentRentalController } from './equipmentRental.controller';

import {
  EquipmentRental,
  EquipmentRentalSchema,
} from './schemas/equipmentRental.schema';

import { Equipment, EquipmentSchema } from '../equipment/schemas/equipment.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EquipmentRental.name, schema: EquipmentRentalSchema },
    ]),
    MongooseModule.forFeature([
      { name: Equipment.name, schema: EquipmentSchema },
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [EquipmentRentalController],
  providers: [EquipmentRentalService],
  exports: [EquipmentRentalService],
})
export class EquipmentRentalModule {}
