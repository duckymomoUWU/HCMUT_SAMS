import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter, SentMessageInfo } from 'nodemailer';
@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor() {
    // Khởi tạo transporter với Gmail
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Generate OTP 6 số
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Gửi OTP verification email
  async sendVerificationEmail(
    email: string,
    otp: string,
    fullName: string,
  ): Promise<SentMessageInfo> {
    const mailOptions = {
      from: `HCMUT SAMS <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Xác thực tài khoản HCMUT SAMS',
      html: `
        <h1>Xác thực tài khoản</h1>
        <p>Xin chào ${fullName},</p>
        <p>Mã OTP của bạn là: <strong style="font-size: 24px;">${otp}</strong></p>
        <p>Mã có hiệu lực trong 10 phút.</p>
      `,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.transporter.sendMail(mailOptions);
  }

  // Gửi OTP reset password
  async sendPasswordResetEmail(
    email: string,
    otp: string,
    fullName: string,
  ): Promise<SentMessageInfo> {
    const mailOptions = {
      from: `HCMUT SAMS <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Đặt lại mật khẩu HCMUT SAMS',
      html: `
        <h1>Đặt lại mật khẩu</h1>
        <p>Xin chào ${fullName},</p>
        <p>Mã OTP để đặt lại mật khẩu: <strong style="font-size: 24px;">${otp}</strong></p>
        <p>Mã có hiệu lực trong 10 phút.</p>
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  // Gửi welcome email sau khi verify
  async sendWelcomeEmail(
    email: string,
    fullName: string,
  ): Promise<SentMessageInfo> {
    const mailOptions = {
      from: `HCMUT SAMS <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Chào mừng đến với HCMUT SAMS',
      html: `
        <h1>Chào mừng!</h1>
        <p>Xin chào ${fullName},</p>
        <p>Tài khoản của bạn đã được kích hoạt thành công!</p>
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
