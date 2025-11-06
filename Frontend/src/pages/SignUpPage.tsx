import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import Logo from "@/assets/hcmut_logo.png";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "@/components/common/GoogleLoginButton";
import { validateHCMUTEmail, validatePassword } from "@/utils/validation";
import { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/auth.types";
import authService from "@/services/authService";

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    if (!validateHCMUTEmail(formData.email)) {
      setError("Email phải có định dạng @hcmut.edu.vn");
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
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
      const errorMessage =
        axiosError.response?.data?.message || "Đăng ký thất bại";

      // Handle specific error messages from backend
      if (errorMessage === "Email already exists") {
        setError("Email đã tồn tại trong hệ thống");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-linear-to-bl from-[#EEEEEE] to-[#51A4F1] pb-3">
      {/* Box */}
      <div className="my-4 flex h-[90%] flex-col rounded-2xl bg-white px-12 py-4 text-black shadow-xl">
        {/* Header */}
        <div className="my-4 flex flex-col items-center px-16">
          <img src={Logo} alt="HCMUT Logo" width={120} height={120} />
          <div className="mt-2 text-2xl font-semibold text-(--blue-med)">
            Đăng ký
          </div>
          <div className="text-sm text-gray-600">
            Chào mừng bạn! Hãy đăng ký để bắt đầu!
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4">
            <p className="text-center text-sm text-red-600 sm:text-base">
              {error}
            </p>
          </div>
        )}

        {/* Register Form */}
        <form className="flex h-full flex-col gap-2" onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div className="flex items-center gap-2 border border-gray-300 p-2">
            <User className="text-gray-400 sm:left-4 sm:h-6 sm:w-6" />
            <input
              type="text"
              name="fullName"
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={handleChange}
              disabled={loading}
              className="w-full focus:outline-none"
            />
          </div>

          {/* Email Input */}
          <div className="flex gap-2 border border-gray-300 p-2">
            <Mail className="text-gray-400 sm:left-4 sm:h-6 sm:w-6" />
            <input
              type="email"
              name="email"
              placeholder="Email (@hcmut.edu.vn)"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full focus:outline-none"
            />
          </div>

          {/* Phone Input (Optional) */}
          <div className="flex gap-2 border border-gray-300 p-2">
            <Phone className="text-gray-400 sm:left-4 sm:h-6 sm:w-6" />
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại (tùy chọn)"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              className="w-full focus:outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="flex gap-2 border border-gray-300 p-2">
            <Lock className="text-gray-400 sm:left-4 sm:h-6 sm:w-6" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 transition-colors hover:text-[#51A4F1] sm:right-4"
            >
              {showPassword ? (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="flex gap-2 border border-gray-300 p-2">
            <Lock className="text-gray-400 sm:left-4 sm:h-6 sm:w-6" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className="w-full focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-500 transition-colors hover:text-[#51A4F1] sm:right-4"
            >
              {showConfirmPassword ? (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 cursor-pointer rounded-sm bg-[#51A4F1] p-2 font-semibold text-white transition-colors duration-200 hover:bg-[#63B6FF]"
          >
            {loading ? "Đang đăng ký..." : "Tiếp tục"}
          </button>

          {/* Divider */}
          <div className="relative my-2 sm:my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="bg-white px-3 text-gray-500 sm:px-4">Hoặc</span>
            </div>
          </div>

          {/* Google Register Button */}
          <GoogleLoginButton disabled={loading} />
        </form>

        {/* Sign up link */}
        <div className="mt-1 flex items-center justify-center gap-1 text-sm">
          <span>Đã có tài khoản</span>
          <div
            onClick={() => navigate("/sign-in")}
            className="cursor-pointer rounded-sm p-1 font-medium text-[#51A4F1] underline hover:text-[#63B6FF]"
          >
            Đăng nhập
          </div>
        </div>
      </div>
      <div className="*:[a]:hover:text-primary text-muted-foreground *:[a]:underline-offetset-4 px-6 text-center text-xs text-balance *:[a]:underline">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  );
};

export default SignUpPage
