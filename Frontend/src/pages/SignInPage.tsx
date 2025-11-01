import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Logo from "@/assets/hcmut_logo.png";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-bl from-[#EEEEEE] to-[#51A4F1]">
      {/* Box */}
      <div className="m-4 flex flex-col rounded-2xl bg-white p-12 text-black shadow-xl">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center px-16">
          <img src={Logo} alt="HCMUT Logo" width={50} height={50} />
          <div className="mt-2 text-2xl font-semibold">Chào mừng quay lại</div>
          <div className="text-sm text-gray-600">
            Đăng nhập vào tài khoản SASS của bạn
          </div>
        </div>

        {/* Form */}
        <div className="m-2 flex flex-col gap-2">
          <label className="text-sm font-medium">Tài khoản</label>
          <input
            type="text"
            placeholder="abc@gmail.com"
            className="rounded-sm border border-gray-400 p-2 transition-all duration-200 focus:border-[#51A4F1] focus:ring-2 focus:ring-[#51A4F1] focus:outline-none"
          />

          <label className="text-sm font-medium">Mật khẩu</label>
          <div className="relative mb-4">
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

          <button className="cursor-pointer rounded-sm bg-[#51A4F1] p-2 font-semibold text-white transition-colors duration-200 hover:bg-[#63B6FF]">
            Đăng nhập
          </button>
        </div>

        {/* Sign up link */}
        <div className="mt-2 flex items-center justify-center gap-1 text-sm">
          <span>Chưa có tài khoản?</span>
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
