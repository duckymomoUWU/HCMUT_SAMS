// Backend/src/modules/booking/booking.module.ts
/* eslint-disable */
import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { NotificationModule } from '../notification/notification.module';
// import { PenaltyHistoryModule } from '../penalty-history/penalty-history.module';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { PaymentModule } from '../payment/payment.module'; // Import PaymentModule

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: User.name, schema: UserSchema },
    ]),
    NotificationModule,
    PaymentModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService, MongooseModule],
})
export class BookingModule {}