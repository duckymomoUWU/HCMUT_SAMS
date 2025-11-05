import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, lowercase: true }) 
  email: string;

  @Prop()
  password?: string; // Optional for OAuth users

  @Prop()
  phone?: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ enum: ['student', 'admin'], default: 'student' })
  role: string;

  //account status
  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ enum: ['active', 'inactive', 'banned'], default: 'active' })
  status: string;

  @Prop()
  otp?: string; // (6 nums)

  @Prop()
  otpExpiry?: Date; //time otp expires

  @Prop()
  resetOtp?: string; // (6 nums)

  @Prop()
  resetOtpExpiry?: Date; //time reset otp expires

  // google oauth
  @Prop()
  googleId?: string;

  // JWT Refresh Token
  @Prop()
  refreshToken?: string;

  // Penalties
  @Prop({ default: 0 })
  penaltyPoints: number;

  @Prop()
  penaltyExpiry?: Date;

  @Prop({ default: false })
  deleted: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
// Email chỉ unique khi đã verify (Partial Unique Index)
UserSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { isVerified: true },
  },
);
UserSchema.index({ googleId: 1 });
