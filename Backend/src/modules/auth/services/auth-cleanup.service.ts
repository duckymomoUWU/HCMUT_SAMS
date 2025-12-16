import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema'; 

@Injectable()
export class AuthCleanupService {
  private readonly logger = new Logger(AuthCleanupService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Chạy mỗi ngày lúc 2 giờ sáng
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupUnverifiedUsers() {
    // Xóa user chưa verify và tạo hơn 24 giờ trước
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await this.userModel.deleteMany({
      isVerified: false,
      createdAt: { $lt: oneDayAgo }, // Tạo trước 24h
    });

    this.logger.log(`🧹 Cleaned up ${result.deletedCount} unverified users`);
  }

  // (Optional) Cũng có thể xóa theo OTP expiry
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupExpiredOTP() {
    const result = await this.userModel.deleteMany({
      isVerified: false,
      otpExpiry: { $lt: new Date() }, // OTP đã hết hạn
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Và tạo > 24h
    });

    this.logger.log(`🧹 Deleted ${result.deletedCount} users with expired OTP`);
  }
}
