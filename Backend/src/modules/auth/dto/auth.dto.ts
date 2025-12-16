import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { IsHCMUTEmail } from '../validator/hcmut-email.validator';

// DTO cho Register
export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  @IsHCMUTEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase and number',
  })
  password: string;

  @IsString()
  phone?: string;
}

// DTO cho Verify OTP
export class VerifyOtpDto {
  @IsNotEmpty()
  @IsEmail()
  @IsHCMUTEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp: string; // 6 digits
}

// DTO cho Login
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @IsHCMUTEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

// DTO cho Forgot Password
export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @IsHCMUTEmail()
  email: string;
}

// DTO cho Reset Password
export class ResetPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  @IsHCMUTEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}

// DTO cho Refresh Token
export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

// DTO cho Resend OTP
export class ResendOtpDto {
  @IsNotEmpty()
  @IsEmail()
  @IsHCMUTEmail()
  email: string;
}
