import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthService } from './modules/auth/auth.service';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './modules/auth/schemas/user.schema';

async function seedAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const userModel = app.get<Model<UserDocument>>('UserModel');
  
  // Thông tin admin
  const adminEmail = 'admin@hcmut.edu.vn';
  const adminPassword = 'Admin@123456';
  
  // Kiểm tra đã tồn tại chưa
  const existingAdmin = await userModel.findOne({ email: adminEmail });
  
  if (existingAdmin) {
    console.log('❌ Admin already exists!');
    await app.close();
    return;
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  // Tạo admin
  const admin = new userModel({
    fullName: 'System Administrator',
    email: adminEmail,
    password: hashedPassword,
    role: 'admin',
    isVerified: true,
    status: 'active',
  });
  
  await admin.save();
  
  console.log('✅ Admin account created successfully!');
  console.log('📧 Email:', adminEmail);
  console.log('🔑 Password:', adminPassword);
  console.log('⚠️  Please change password after first login!');
  
  await app.close();
}

seedAdmin();