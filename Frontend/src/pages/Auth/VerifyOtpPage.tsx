import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { validateOtp } from "@/utils";

import hcmutLogo from "@/assets/hcmut_logo.png";
import { authService } from "@/services";
import type { AxiosError } from "axios";

import type { ErrorResponse } from "@/types";
import OTPInput from "@/components/common/OTPInput";

const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds

  // TIMER
  useEffect(() => {
    if (!email) {
      navigate("/register");
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev < 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  // FORMAT TIME
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // HANDLE ENTER OTP
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } },
  ) => {
    const value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length <= 6) {
      setOtp(value);
      setError("");
    }
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateOtp(otp)) {
      setError("OTP phải có 6 chữ số");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.verifyOtp({ email, otp });

      if (response.success) {
        setSuccess("Xác thực thành công! Đang chuyển đến trang đăng nhập...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Xác thực thất bại";

      if (errorMessage === "Invalid OTP") {
        setError("OTP không đúng");
      } else if (errorMessage === "OTP expired") {
        setError("OTP đã hết hạn. Vui lòng yêu cầu OTP mới");
      } else if (errorMessage === "Email already verified") {
        setError("Email đã được xác thực. Vui lòng đăng nhập");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
    setResendLoading(true);

    try {
      const response = await authService.resendOtp({ email });

      if (response.success) {
        setSuccess("OTP mới đã được gửi đến email của bạn");
        setCountdown(600); // Reset countdown
        setOtp(""); // Clear OTP input
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Gửi lại OTP thất bại";

      if (errorMessage === "Email already verified") {
        setError("Email đã được xác thực. Vui lòng đăng nhập");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(errorMessage);
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    // Background
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-linear-to-bl from-[#EEEEEE] to-[#51A4F1]">
      {/* Form */}
      <div className="m-4 flex w-[32%] flex-col items-center space-y-4 rounded-2xl bg-white p-10 text-black shadow-xl">
        {/* Logo */}
        <img
          src={hcmutLogo}
          alt="HCMUT Logo"
          className="flex h-[120px] w-[120px] object-contain"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        {/* Header */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="text-4xl font-bold text-[#007BE5]">Xác thực OTP</div>
          <div className="flex flex-col items-center text-sm font-semibold">
            Chúng tôi đã gửi mã OTP 6 chữ số đến email:
            <span className="font-semibold text-[#007BE5]">{email}</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 w-[90%] rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4">
            <p className="text-center text-sm text-red-600 sm:text-base">
              {error}
            </p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-3 sm:p-4">
            <p className="text-center text-sm text-green-600 sm:text-base">
              {success}
            </p>
          </div>
        )}

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* OTP Input */}
          <OTPInput
            otp={otp}
            onChange={handleChange}
            disabled={loading || countdown === 0}
          />

          {/* Countdown Timer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 sm:text-base">
              Mã OTP sẽ hết hạn sau:{" "}
              <span
                className={`font-semibold ${
                  countdown < 60 ? "text-red-600" : "text-[#007BE5]"
                }`}
              >
                {formatTime(countdown)}
              </span>
            </p>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading || otp.length !== 6 || countdown === 0}
            className={`w-full rounded-2xl ${!loading ? "cursor-pointer bg-blue-500 hover:bg-blue-300" : "bg-blue-300"} p-4 text-white sm:rounded-[20px]`}
          >
            {loading ? "Đang xác thực..." : "Xác thực"}
          </button>

          {/* Resend OTP */}
          <div className="mt-2 text-center">
            <p className="mb-2 text-sm text-gray-600 sm:text-base">
              Không nhận được OTP?
            </p>
            <button
              onClick={handleResendOtp}
              disabled={resendLoading || countdown === 0}
              className="text-[#007BE5] hover:bg-blue-50 hover:text-[#0066CC]"
            >
              {resendLoading ? "Đang gửi..." : "Gửi lại OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
