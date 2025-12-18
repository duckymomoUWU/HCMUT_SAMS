import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment, PaymentSchema } from './entities/payment.entity';
import {
  EquipmentRental,
  EquipmentRentalSchema,
} from '../equipment-Rental/schemas/equipment-rental.schema';
import { Booking, BookingSchema } from '../booking/schemas/booking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: EquipmentRental.name, schema: EquipmentRentalSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
