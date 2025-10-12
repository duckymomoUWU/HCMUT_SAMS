import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BookingModule } from './modules/booking/booking.module';
import { FacilityModule } from './modules/facility/facility.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { PaymentModule } from './modules/payment/payment.module';
import { CheckinModule } from './modules/checkin/checkin.module';
import { NotificationModule } from './modules/notification/notification.module';
import { HistoryModule } from './modules/history/history.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [AuthModule, BookingModule, FacilityModule, EquipmentModule, PaymentModule, CheckinModule, NotificationModule, HistoryModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
