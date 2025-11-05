import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // Config Module - Load .env file
    ConfigModule.forRoot({
      isGlobal: true, // Cho phép dùng process.env ở mọi nơi
      envFilePath: '.env', // Đọc từ file .env
    }),

    // MongoDB Connection
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/hcmut_sams',
      {
        dbName: process.env.MONGODB_DATABASE || 'hcmut_sams',
        // SSL/TLS options
        tls: true,
        tlsAllowInvalidCertificates: true, // DEV only
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
      },
    ),

    // Feature Modules
    AuthModule,
    BookingModule,
    FacilityModule,
    EquipmentModule,
    PaymentModule,
    CheckinModule,
    NotificationModule,
    HistoryModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
