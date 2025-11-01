import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AxiosError } from 'axios';
import AuthLayout from '../../components/layout/AuthLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import GoogleLoginButton from '../../components/common/GoogleLoginButton';
import { authService } from '../../services/authService';
import { validateHCMUTEmail } from '../../utils/validation';
import { cn } from '../../utils/cn';
import hcmutLogo from '../../assets/hcmut_logo.png';
import type { ErrorResponse } from '../../types/auth.types';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (!validateHCMUTEmail(formData.email)) {
      setError('Email phải có định dạng @hcmut.edu.vn');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(formData);
      
      if (response.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 'Đăng nhập thất bại';
      
      // Handle specific error messages from backend
      if (errorMessage === 'Please verify your email first') {
        setError('Vui lòng xác thực email trước khi đăng nhập');
      } else if (errorMessage === 'Invalid credentials') {
        setError('Email hoặc mật khẩu không đúng');
      } else if (errorMessage === 'Your account has been banned') {
        setError('Tài khoản của bạn đã bị khóa');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout showLoginButton={false}>
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
          <CardTitle>Đăng nhập</CardTitle>
        </CardHeader>

        <CardContent>
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center text-sm sm:text-base">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Email Input */}
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                className="pr-12"
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

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link 
                to="/forgot-password"
                className="text-sm sm:text-base lg:text-lg text-black hover:text-[#007BE5] underline sm:no-underline transition-colors"
              >
                Forgot password
              </Link>
            </div>

            {/* Login Button */}
            <Button 
              type="submit" 
              disabled={loading} 
              size="xl"
              className="w-full rounded-2xl sm:rounded-[20px]"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
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

            {/* Google Login Button */}
            <GoogleLoginButton disabled={loading} />

            {/* Register Link */}
            <div className="text-center mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl">
              <span className="text-black">Tạo tài khoản mới </span>
              <Link 
                to="/register"
                className="text-[#0957A8] hover:underline font-medium transition-all"
              >
                Đăng kí
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
