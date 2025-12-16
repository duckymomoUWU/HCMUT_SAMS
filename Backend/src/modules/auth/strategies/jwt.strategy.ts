import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { ConfigService } from '@nestjs/config'; // Import ConfigService

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService, // Inject ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // SỬ DỤNG KHÓA ACCESS TOKEN
    });
  }

  /**
   * Hàm này chạy sau khi JWT được verify thành công
   * payload = { sub, email, role } từ token
   */
  async validate(payload: any) {
    console.log('JwtStrategy: Validating token payload:', payload); // <-- Thêm dòng này
    // 1. Tìm user trong database
    const user = await this.userModel.findById(new Types.ObjectId(payload.sub));

    // 2. Nếu không tìm thấy → 401
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 3. Kiểm tra user có bị banned không
    if (user.status === 'banned') {
      throw new UnauthorizedException('Account has been banned');
    }

    // 4. Return user object → Gắn vào request.user
    return {
      id: user._id, // <--- Đổi tên từ 'userId' thành 'id'
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };
  }
}