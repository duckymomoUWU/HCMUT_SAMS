import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import authService from '../services/authService';
import { ROUTES } from '../constants/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = authService.isAuthenticated();

      if (!authenticated) {
        // Token không hợp lệ hoặc đã hết hạn
        setIsValid(false);
        setIsChecking(false);
        return;
      }

      // Check role nếu cần
      if (requiredRole) {
        const user = authService.getCurrentUser();
        if (!user || !requiredRole.includes(user.role)) {
          setIsValid(false);
          setIsChecking(false);
          return;
        }
      }

      setIsValid(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [requiredRole]);

  // Đang check
  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-gray-600">Đang kiểm tra xác thực...</div>
      </div>
    );
  }

  // Không có quyền truy cập
  if (!isValid) {
    const user = authService.getCurrentUser();
    
    // Nếu có user nhưng sai role → Redirect về dashboard phù hợp với role
    if (user && requiredRole && !requiredRole.includes(user.role)) {
      // Admin vào nhầm client route → Redirect về admin dashboard
      if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
      }
      // Student vào nhầm admin route → Redirect về client dashboard
      if (user.role === 'student') {
        return <Navigate to="/client" replace />;
      }
    }

    // Không có user → Redirect về login
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};