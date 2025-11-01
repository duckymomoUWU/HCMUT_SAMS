import React from 'react';
import { cn } from '../../utils/cn';
import AuthHeader from './AuthHeader';
import AuthFooter from './AuthFooter';

interface AuthLayoutProps {
  children: React.ReactNode;
  showLoginButton?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, showLoginButton = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#E5F4FF] to-[#51A4F1]">
      <AuthHeader showLoginButton={showLoginButton} />
      
      <main className={cn(
        "flex-1 flex items-center justify-center",
        "py-4 px-4",
        "sm:py-8 sm:px-6",
        "lg:py-12 lg:px-8"
      )}>
        {children}
      </main>

      <AuthFooter />
    </div>
  );
};

export default AuthLayout;
