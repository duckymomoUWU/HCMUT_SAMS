import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { EmailService } from './services/email.service';
import {
  RegisterDto,
  LoginDto,
  VerifyOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // ========== REGISTER với OTP ==========
  async register(registerDto: RegisterDto) {
    // 1. Check email đã tồn tại chưa
    const existingUser = await this.userModel.findOne({
      email: registerDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 3. Generate OTP
    const otp = this.emailService.generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    // 4. Tạo user mới (chưa verify)
    const newUser = new this.userModel({
      ...registerDto,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
      status: 'inactive',
    });

    await newUser.save();

    // 5. Gửi OTP email
    await this.emailService.sendVerificationEmail(
      registerDto.email,
      otp,
      registerDto.fullName,
    );

    return {
      success: true,
      message: 'OTP sent to your email. Please verify within 10 minutes.',
      email: registerDto.email,
    };
  }

  // ========== VERIFY OTP ==========
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    // 1. Tìm user
    const user = await this.userModel.findOne({ email: verifyOtpDto.email });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // 2. Check đã verify chưa
    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    // 3. Check OTP
    if (user.otp !== verifyOtpDto.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // 4. Check OTP expiry
    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    // 5. Update user: verified
    user.isVerified = true;
    user.status = 'active';
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // 6. Gửi welcome email
    await this.emailService.sendWelcomeEmail(user.email, user.fullName);

    return {
      success: true,
      message: 'Email verified successfully. You can now login.',
    };
  }

  // ========== LOGIN ==========
  async login(loginDto: LoginDto) {
    // 1. Tìm user
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Check đã verify chưa
    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    // 3. Check password exists (for Google OAuth users, password might be undefined)
    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 4. Check password validity
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 5. Check status
    if (user.status === 'banned') {
      throw new UnauthorizedException('Your account has been banned');
    }

    // 6. Generate tokens
    const tokens = this.generateTokens(user);

    // 7. Save refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      ...tokens,
    };
  }

  // ========== FORGOT PASSWORD ==========
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    // 1. Tìm user
    const user = await this.userModel.findOne({
      email: forgotPasswordDto.email,
    });
    if (!user) {
      throw new BadRequestException('Email not found');
    }

    // 2. Generate reset OTP
    const resetOtp = this.emailService.generateOTP();
    const resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    // 3. Save reset OTP
    user.resetOtp = resetOtp;
    user.resetOtpExpiry = resetOtpExpiry;
    await user.save();

    // 4. Gửi email
    await this.emailService.sendPasswordResetEmail(
      user.email,
      resetOtp,
      user.fullName,
    );

    return {
      success: true,
      message: 'Reset OTP sent to your email',
    };
  }

  // ========== RESET PASSWORD ==========
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // 1. Tìm user
    const user = await this.userModel.findOne({
      email: resetPasswordDto.email,
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // 2. Check reset OTP
    if (user.resetOtp !== resetPasswordDto.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // 3. Check expiry
    if (!user.resetOtpExpiry || user.resetOtpExpiry < new Date()) {
      throw new BadRequestException('OTP expired');
    }

    // 4. Hash new password
    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);

    // 5. Update password
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }

  // ========== RESEND OTP ==========
  async resendOtp(email: string) {
    // 1. Tìm user theo email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // 2. Check đã verify chưa
    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    // 3. Generate OTP mới
    const otp = this.emailService.generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    // 4. Update OTP mới
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // 5. Gửi email OTP mới
    await this.emailService.sendVerificationEmail(
      user.email,
      otp,
      user.fullName,
    );

    return {
      success: true,
      message: 'New OTP sent to your email. Please verify within 10 minutes.',
      email: user.email,
    };
  }

  // ========== GOOGLE OAUTH LOGIN ==========
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async googleLogin(googleUser: any) {
    // 1. Check email có đúng @hcmut.edu.vn không
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    if (!googleUser.email.endsWith('@hcmut.edu.vn')) {
      throw new UnauthorizedException('Only @hcmut.edu.vn emails are allowed');
    }

    // 2. Tìm hoặc tạo user
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    let user = await this.userModel.findOne({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      $or: [{ googleId: googleUser.googleId }, { email: googleUser.email }],
    });

    if (user) {
      // User đã tồn tại → update thông tin Google
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      user.googleId = googleUser.googleId;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      user.avatarUrl = googleUser.avatarUrl;
      user.isVerified = true; // Google account = đã verify
      user.status = 'active';
      await user.save();
    } else {
      // User mới → tạo mới
      user = new this.userModel({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        googleId: googleUser.googleId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        email: googleUser.email,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        fullName: googleUser.fullName,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        avatarUrl: googleUser.avatarUrl,
        isVerified: true, // Google OAuth = tự động verify
        status: 'active',
        role: 'student',
      });
      await user.save();
    }

    // 3. Generate tokens
    const tokens = this.generateTokens(user);

    // 4. Save refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return {
      success: true,
      message: 'Google login successful',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      ...tokens,
    };
  }

  // ========== HELPER: Generate JWT Tokens ==========
  private generateTokens(user: UserDocument) {
    const payload = {
      sub: String(user._id), // Convert ObjectId to string
      email: user.email,
      role: user.role,
    };

    // Access token (sử dụng config mặc định từ JwtModule)
    const accessToken = this.jwtService.sign(payload);

    // Refresh token (cần secret riêng + expiry khác)
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}
