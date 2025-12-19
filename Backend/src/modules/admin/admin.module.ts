import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { BookingModule } from '../booking/booking.module';
import { EquipmentRentalModule } from '../equipment-Rental/equipmentRental.module';

@Module({
  imports: [BookingModule, EquipmentRentalModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
