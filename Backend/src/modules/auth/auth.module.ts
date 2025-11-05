import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './schemas/user.schema';
import { EmailService } from './services/email.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
     PassportModule.register({ defaultStrategy: 'google' }),
    // Đăng ký User schema với Mongoose
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    // Đăng ký JwtModule với config từ .env
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: '1h', // Hardcode để tránh type error
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, GoogleStrategy], 
  exports: [AuthService],
})
export class AuthModule {}
