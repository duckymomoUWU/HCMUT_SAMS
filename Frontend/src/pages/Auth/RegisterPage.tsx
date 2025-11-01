import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Phone } from 'lucide-react';
import { AxiosError } from 'axios';
import AuthLayout from '../../components/layout/AuthLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import GoogleLoginButton from '../../components/common/GoogleLoginButton';
import { authService } from '../../services/authService';
import { validateHCMUTEmail, validatePassword } from '../../utils/validation';
import { cn } from '../../utils/cn';
import hcmutLogo from '../../assets/hcmut_logo.png';
import type { ErrorResponse } from '../../types/auth.types';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    if (!validateHCMUTEmail(formData.email)) {
      setError('Email phải có định dạng @hcmut.edu.vn');
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      });

      if (response.success) {
        // Navigate to verify OTP page with email
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 'Đăng ký thất bại';
      
      // Handle specific error messages from backend
      if (errorMessage === 'Email already exists') {
        setError('Email đã tồn tại trong hệ thống');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout showLoginButton={true}>
      <Card>
        {/* Logo */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <img 
            src={hcmutLogo} 
            alt="HCMUT Logo" 
            className={cn(
              "object-contain",
              "h-[120px] w-[120px]",
              "sm:h-[160px] sm:w-[160px]",
              "md:h-[180px] md:w-[180px]",
              "lg:h-[200px] lg:w-[200px]"
            )}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        <CardHeader className="mb-6 sm:mb-8">
          <CardTitle>Đăng ký</CardTitle>
          <CardDescription className="mt-2">
            Vui lòng nhập đầy đủ thông tin để tạo tài khoản
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center text-sm sm:text-base">{error}</p>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Full Name Input */}
            <div className="relative">
              <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
              <Input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
                className="pl-11 sm:pl-14"
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
              <Input
                type="email"
                name="email"
                placeholder="Email (@hcmut.edu.vn)"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                className="pl-11 sm:pl-14"
              />
            </div>

            {/* Phone Input (Optional) */}
            <div className="relative">
              <Phone className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
              <Input
                type="tel"
                name="phone"
                placeholder="Số điện thoại (tùy chọn)"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                className="pl-11 sm:pl-14"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="pl-11 sm:pl-14 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Xác nhận mật khẩu"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                className="pl-11 sm:pl-14 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>

            {/* Password Requirements */}
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p>Mật khẩu phải có:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>Ít nhất 6 ký tự</li>
                <li>Ít nhất 1 chữ HOA</li>
                <li>Ít nhất 1 chữ thường</li>
                <li>Ít nhất 1 chữ số</li>
              </ul>
            </div>

            {/* Register Button */}
            <Button 
              type="submit" 
              disabled={loading} 
              variant="secondary"
              size="xl"
              className="w-full rounded-2xl sm:rounded-[20px]"
            >
              {loading ? 'Đang đăng ký...' : 'Tiếp tục'}
            </Button>

            {/* Divider */}
            <div className="relative my-6 sm:my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-3 sm:px-4 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            {/* Google Register Button */}
            <GoogleLoginButton disabled={loading} />

            {/* Login Link */}
            <div className="text-center mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl">
              <span className="text-black">Đã có tài khoản? </span>
              <Link 
                to="/login"
                className="text-[#0957A8] hover:underline font-medium transition-all"
              >
                Đăng nhập
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default RegisterPage;
