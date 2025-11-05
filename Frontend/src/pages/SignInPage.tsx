import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Logo from "@/assets/hcmut_logo.png";
import { useNavigate, Link } from "react-router-dom";
import GoogleLoginButton from "@/components/common/GoogleLoginButton";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-linear-to-bl from-[#EEEEEE] to-[#51A4F1]">
      {/* Box */}
      <div className="m-4 flex w-[32%] flex-col rounded-2xl bg-white p-10 text-black shadow-xl">
        {/* Header */}
        <div className="mb-4 flex flex-col items-center gap-4 px-16">
          <img src={Logo} alt="HCMUT Logo" width={120} height={120} />
          <div className="text-3xl font-semibold text-(--blue-med)">
            Đăng nhập
          </div>
        </div>

        {/* Form */}
        <div className="my-2 flex w-full flex-col gap-4">
          <input
            type="text"
            placeholder="Email"
            className="rounded-sm border border-gray-400 p-2 transition-all duration-200 focus:border-[#51A4F1] focus:ring-2 focus:ring-[#51A4F1] focus:outline-none"
          />

          <div className="relative mb-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              className="w-full rounded-sm border border-gray-400 p-2 pr-10 transition-all duration-200 focus:border-[#51A4F1] focus:ring-2 focus:ring-[#51A4F1] focus:outline-none"
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

          <button className="cursor-pointer rounded-sm bg-[#51A4F1] p-2 font-semibold text-white transition-colors duration-200 hover:bg-[#63B6FF]">
            Đăng nhập
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-2 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs sm:text-sm">
            <span className="bg-white px-3 text-gray-500 sm:px-4">Hoặc</span>
          </div>
        </div>

        <GoogleLoginButton />

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
      <div className="*:[a]:hover:text-primary text-muted-foreground *:[a]:underline-offetset-4 px-6 text-center text-xs text-balance *:[a]:underline">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  );
};

export default SignInPage;
