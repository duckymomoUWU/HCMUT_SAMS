import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    // Lấy thông tin profile của user đang đăng nhập
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        const userId = req.user.userId || req.user.sub || req.user._id;
        return this.usersService.getProfile(userId);
    }

    // Cập nhật thông tin profile
    @UseGuards(JwtAuthGuard)
    @Put('profile')
    updateProfile(@Req() req, @Body() updateData: { fullName?: string; phone?: string }) {
        const userId = req.user.userId || req.user.sub || req.user._id;
        return this.usersService.updateProfile(userId, updateData);
    }

    // Lấy thống kê dashboard
    @UseGuards(JwtAuthGuard)
    @Get('dashboard')
    getDashboardStats(@Req() req) {
        const userId = req.user.userId || req.user.sub || req.user._id;
        return this.usersService.getDashboardStats(userId);
    }
}