import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import hcmutLogo from '../../assets/hcmut_logo.png';

interface AuthHeaderProps {
  showLoginButton?: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ showLoginButton = true }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white w-full shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-[80px] sm:h-[100px] lg:h-[119px] flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
          <img 
            src={hcmutLogo} 
            alt="HCMUT Logo" 
            className={cn(
              "object-contain",
              "h-[50px] w-[50px]",
              "sm:h-[70px] sm:w-[70px]",
              "lg:h-[90px] lg:w-[90px]"
            )}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <h1 className={cn(
              "text-[#007BE5] font-bold leading-tight tracking-wide",
              "text-xl sm:text-2xl lg:text-[37px]"
            )}>
              HCMUT SAMS
            </h1>
            <p className={cn(
              "text-[#007BE5] font-bold",
              "text-xs sm:text-sm lg:text-[23px]",
              "hidden sm:block"
            )}>
              Sports Arena Management System
            </p>
          </div>
        </div>

        {/* Login Button */}
        {showLoginButton && (
          <button
            onClick={() => navigate('/login')}
            className={cn(
              "bg-[#007BE5] hover:bg-[#0066CC] text-white rounded-lg",
              "font-bold transition-colors duration-200",
              "flex items-center gap-1.5 sm:gap-2",
              "px-4 py-2 text-sm",
              "sm:px-6 sm:py-2.5 sm:text-base",
              "lg:px-8 lg:py-3 lg:text-[23px]"
            )}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">Đăng nhập</span>
            <span className="sm:hidden">Login</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default AuthHeader;
