import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  VerifyOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ResendOtpDto,
} from './dto/auth.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ========== REGISTER ==========
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // ========== VERIFY OTP ==========
  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  // ========== RESEND OTP ==========
  @Public()
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto.email);
  }

  // ========== LOGIN ==========
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // ========== FORGOT PASSWORD ==========
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  // ========== RESET PASSWORD ==========
  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
  // ========== REFRESH TOKEN ==========
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
  // ========== GOOGLE OAUTH ==========
  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Guard sẽ redirect đến Google login
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    try {
      const result = await this.authService.googleLogin(req.user);

      // Redirect về frontend với tokens
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Google Login Success</title>
            <script>
              console.log('Callback received, sending message to opener...');
            </script>
          </head>
          <body>
            <p style="text-align: center; padding: 50px; font-family: Arial;">
              Đăng nhập thành công! Đang chuyển hướng...
            </p>
            <script>
              try {
                const result = ${JSON.stringify(result)};
                console.log('Sending result:', result);
                
                if (window.opener) {
                  // Send message to parent window
                  window.opener.postMessage(result, '${frontendUrl}');
                  console.log('Message sent to opener');
                  
                  // Close after a short delay
                  setTimeout(() => {
                    window.close();
                  }, 1000);
                } else {
                  console.error('No window.opener found');
                  document.body.innerHTML = '<p style="text-align: center; color: red;">Lỗi: Không tìm thấy cửa sổ cha. Vui lòng đóng tab này và thử lại.</p>';
                }
              } catch (error) {
                console.error('Error in callback:', error);
                document.body.innerHTML = '<p style="text-align: center; color: red;">Đã xảy ra lỗi: ' + error.message + '</p>';
              }
            </script>
          </body>
        </html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      console.error('Google auth error:', error);
      res.status(500).send('Authentication failed');
    }
  }
}
