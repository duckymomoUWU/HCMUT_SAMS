import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Logo from "@/assets/hcmut_logo.png";
import { useNavigate, Link } from "react-router-dom";
import GoogleLoginButton from "@/components/common/GoogleLoginButton";
import type { ErrorResponse } from "@/types/auth.types";
import { validateHCMUTEmail } from "@/utils/validation";
import { authService } from "@/services";
import { AxiosError } from "axios";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    if (!formData.email || !formData.password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (!validateHCMUTEmail(formData.email)) {
      setError("Email phải có định dạng @hcmut.edu.vn");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(formData);

      if (response.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Đăng nhập thất bại";

      // Handle specific error messages from backend
      if (errorMessage === "Please verify your email first") {
        setError("Vui lòng xác thực email trước khi đăng nhập");
      } else if (errorMessage === "Invalid credentials") {
        setError("Email hoặc mật khẩu không đúng");
      } else if (errorMessage === "Your account has been banned") {
        setError("Tài khoản của bạn đã bị khóa");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-linear-to-bl from-[#EEEEEE] to-[#51A4F1]">
      {/* Box */}
      <div className="m-4 flex w-[32%] flex-col rounded-2xl bg-white p-10 text-black shadow-xl">
        {/* Header */}
        <div className="mb-4 flex flex-col items-center gap-4 px-16">
          <img
            src={Logo}
            alt="HCMUT Logo"
            width={120}
            height={120}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="text-3xl font-semibold text-(--blue-med)">
            Đăng nhập
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 sm:p-4">
            <p className="text-center text-sm text-red-600 sm:text-base">
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="my-2 flex w-full flex-col gap-4"
        >
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="rounded-sm border border-gray-400 p-2 transition-all duration-200 focus:border-[#51A4F1] focus:ring-2 focus:ring-[#51A4F1] focus:outline-none"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />

          <div className="relative mb-1">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              className="w-full rounded-sm border border-gray-400 p-2 pr-10 transition-all duration-200 focus:border-[#51A4F1] focus:ring-2 focus:ring-[#51A4F1] focus:outline-none"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-colors hover:text-[#51A4F1]"
            >
              {showPassword ? (
                <EyeOff size={18} strokeWidth={1.8} />
              ) : (
                <Eye size={18} strokeWidth={1.8} />
              )}
            </button>
          </div>

          <Link
            to="/forgot-password"
            className="mb-1 flex justify-end underline transition-colors hover:text-[#007BE5] sm:no-underline"
          >
            Quên mật khẩu
          </Link>

          <button
            disabled={loading}
            className="cursor-pointer rounded-sm bg-[#51A4F1] p-2 font-semibold text-white transition-colors duration-200 hover:bg-[#63B6FF]"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-2 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs sm:text-sm">
            <span className="bg-white px-3 text-gray-500 sm:px-4">Hoặc</span>
          </div>
        </div>

        <GoogleLoginButton disabled={loading} />

        {/* Sign up link */}
        <div className="mt-2 flex items-center justify-center gap-1 text-sm">
          <span>Tạo tài khoản mới </span>
          <div
            onClick={() => navigate("/sign-up")}
            className="cursor-pointer rounded-sm p-1 font-medium text-[#51A4F1] underline hover:text-[#63B6FF]"
          >
            Đăng ký
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
