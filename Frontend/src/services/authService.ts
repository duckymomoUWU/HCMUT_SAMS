import api from './api';
import type {
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  LoginRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ResendOtpRequest,
  ResendOtpResponse,
} from '../types/auth.types';

class AuthService {
  // ========== REGISTER ==========
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  }

  // ========== VERIFY OTP ==========
  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    const response = await api.post<VerifyOtpResponse>('/auth/verify-otp', data);
    return response.data;
  }

  // ========== RESEND OTP ==========
  async resendOtp(data: ResendOtpRequest): Promise<ResendOtpResponse> {
    const response = await api.post<ResendOtpResponse>('/auth/resend-otp', data);
    return response.data;
  }

  // ========== LOGIN ==========
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    
    // Save tokens and user to localStorage
    if (response.data.success) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  // ========== FORGOT PASSWORD ==========
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', data);
    return response.data;
  }

  // ========== RESET PASSWORD ==========
  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await api.post<ResetPasswordResponse>('/auth/reset-password', data);
    return response.data;
  }

  // ========== LOGOUT ==========
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // ========== GET CURRENT USER ==========
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // ========== CHECK AUTH ==========
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // ========== GOOGLE OAUTH ==========
  googleLogin(): void {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      `${API_URL}/auth/google`,
      'Google Login',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for message from popup
    const handleMessage = (event: MessageEvent) => {
      // Accept message from backend server
      if (event.origin !== API_URL) {
        console.log('Ignored message from:', event.origin);
        return;
      }

      console.log('Received message:', event.data);

      const { success, user, accessToken, refreshToken } = event.data;
      
      if (success && accessToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Remove event listener
        window.removeEventListener('message', handleMessage);
        
        // Close popup
        if (popup && !popup.closed) {
          popup.close();
        }
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    };

    window.addEventListener('message', handleMessage);

    // Check if popup was blocked
    if (!popup || popup.closed) {
      alert('Popup bị chặn! Vui lòng cho phép popup và thử lại.');
      window.removeEventListener('message', handleMessage);
    }
  }
}

export const authService = new AuthService();
export default authService;
