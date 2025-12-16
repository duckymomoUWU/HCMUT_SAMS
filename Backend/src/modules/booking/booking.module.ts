<<<<<<< HEAD
import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
=======
/* eslint-disable */
// Backend/src/modules/booking/booking.module.ts
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
    // PenaltyHistoryModule,
    PaymentModule, // Add PaymentModule here
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService, MongooseModule],
})
export class BookingModule {}
>>>>>>> ba1cac7 (chore: Project configuration, dependency updates, and NOT fix JWT setup)
