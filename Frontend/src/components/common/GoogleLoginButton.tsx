import React from "react";
import { authService } from "@/services";

interface GoogleLoginButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  const handleGoogleLogin = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    } else {
      authService.googleLogin();
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-400 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:gap-3 sm:py-3 sm:text-base"
    >
      {/* Google Icon SVG */}
      <svg
        className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.8 10.2273C19.8 9.51819 19.7364 8.83637 19.6182 8.18182H10.2V12.05H15.5818C15.3273 13.3 14.5727 14.3591 13.4636 15.0682V17.5773H16.7818C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z"
          fill="#4285F4"
        />
        <path
          d="M10.2 20C12.9 20 15.1727 19.1046 16.7818 17.5773L13.4636 15.0682C12.5227 15.6682 11.3045 16.0227 10.2 16.0227C7.59091 16.0227 5.37273 14.2636 4.54091 11.9H1.11364V14.4909C2.71364 17.759 6.19091 20 10.2 20Z"
          fill="#34A853"
        />
        <path
          d="M4.54091 11.9C4.31818 11.3 4.19091 10.6591 4.19091 10C4.19091 9.34091 4.31818 8.7 4.54091 8.1V5.50909H1.11364C0.418182 6.89091 0 8.4 0 10C0 11.6 0.418182 13.1091 1.11364 14.4909L4.54091 11.9Z"
          fill="#FBBC04"
        />
        <path
          d="M10.2 3.97727C11.3955 3.97727 12.4636 4.38182 13.2955 5.14091L16.2409 2.19545C15.1727 1.24545 12.9 0 10.2 0C6.19091 0 2.71364 2.24091 1.11364 5.50909L4.54091 8.1C5.37273 5.73636 7.59091 3.97727 10.2 3.97727Z"
          fill="#EA4335"
        />
      </svg>
      <span>Đăng nhập bằng Google</span>
    </button>
  );
};

export default GoogleLoginButton;
