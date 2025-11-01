import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import AuthLayout from '../../components/layout/AuthLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { authService } from '../../services/authService';
import { validateOtp } from '../../utils/validation';
import { cn } from '../../utils/cn';
import hcmutLogo from '../../assets/hcmut_logo.png';
import type { ErrorResponse } from '../../types/auth.types';

const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (value.length <= 6) {
      setOtp(value);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateOtp(otp)) {
      setError('OTP phải có 6 chữ số');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.verifyOtp({ email, otp });

      if (response.success) {
        setSuccess('Xác thực thành công! Đang chuyển đến trang đăng nhập...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 'Xác thực thất bại';

      if (errorMessage === 'Invalid OTP') {
        setError('OTP không đúng');
      } else if (errorMessage === 'OTP expired') {
        setError('OTP đã hết hạn. Vui lòng yêu cầu OTP mới');
      } else if (errorMessage === 'Email already verified') {
        setError('Email đã được xác thực. Vui lòng đăng nhập');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccess('');
    setResendLoading(true);

    try {
      const response = await authService.resendOtp({ email });

      if (response.success) {
        setSuccess('OTP mới đã được gửi đến email của bạn');
        setCountdown(600); // Reset countdown
        setOtp(''); // Clear OTP input
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || 'Gửi lại OTP thất bại';

      if (errorMessage === 'Email already verified') {
        setError('Email đã được xác thực. Vui lòng đăng nhập');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(errorMessage);
      }
    } finally {
      setResendLoading(false);
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
          <CardTitle>Xác thực OTP</CardTitle>
          <CardDescription className="mt-2">
            Chúng tôi đã gửi mã OTP 6 chữ số đến email: <br />
            <span className="font-semibold text-[#007BE5]">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center text-sm sm:text-base">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-center text-sm sm:text-base">{success}</p>
            </div>
          )}

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
            {/* OTP Input */}
            <div>
              <Input
                type="text"
                name="otp"
                placeholder="Nhập mã OTP (6 chữ số)"
                value={otp}
                onChange={handleChange}
                disabled={loading || countdown === 0}
                className="text-center text-2xl sm:text-3xl tracking-widest"
                maxLength={6}
              />
            </div>

            {/* Countdown Timer */}
            <div className="text-center">
              <p className="text-sm sm:text-base text-gray-600">
                Mã OTP sẽ hết hạn sau:{' '}
                <span className={cn(
                  "font-semibold",
                  countdown < 60 ? "text-red-600" : "text-[#007BE5]"
                )}>
                  {formatTime(countdown)}
                </span>
              </p>
            </div>

            {/* Verify Button */}
            <Button 
              type="submit" 
              disabled={loading || otp.length !== 6 || countdown === 0} 
              size="xl"
              className="w-full rounded-2xl sm:rounded-[20px]"
            >
              {loading ? 'Đang xác thực...' : 'Xác thực'}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                Không nhận được OTP?
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOtp}
                disabled={resendLoading || countdown === 0}
                className="text-[#007BE5] hover:text-[#0066CC] hover:bg-blue-50"
              >
                {resendLoading ? 'Đang gửi...' : 'Gửi lại OTP'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default VerifyOtpPage;
