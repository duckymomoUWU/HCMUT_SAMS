import { api } from './api';

// Types
export interface UserProfile {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    role: string;
    isVerified: boolean;
    status: string;
    penaltyPoints: number;
    createdAt: string;
    updatedAt: string;
}

export interface DashboardStats {
    bookingsThisMonth: number;
    activeRentals: number;
    spendingThisMonth: number;
    penaltyPoints: number;
    recentActivities: Array<{
        id: string;
        type: string;
        equipment: { _id: string; name: string; type: string } | null;
        date: string;
        status: string;
        totalPrice: number;
    }>;
    upcomingRentals: Array<{
        id: string;
        equipment: { _id: string; name: string; type: string } | null;
        date: string;
        duration: number;
        status: string;
    }>;
}

class UserService {
    // Lấy danh sách tất cả users (admin)
    async getUsers() {
        const res = await api.get('/users');
        return res.data;
    }

    // Lấy profile của user đang đăng nhập
    async getProfile(): Promise<UserProfile> {
        const res = await api.get('/users/profile');
        return res.data;
    }

    // Cập nhật profile
    async updateProfile(data: { fullName?: string; phone?: string }): Promise<UserProfile> {
        const res = await api.put('/users/profile', data);
        return res.data;
    }

    // Lấy thống kê dashboard
    async getDashboardStats(): Promise<DashboardStats> {
        const res = await api.get('/users/dashboard');
        return res.data;
    }
}

const userService = new UserService();
export default userService;

// Export cũ để backward compatible
export const getUsers = async () => {
    const res = await api.get('/users');
    return res.data;
}