import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { ProtectedRoute } from './ProtectedRoute';

// Pages
import MainPage from '../pages/HomePage/MainPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import VerifyOtpPage from '../pages/Auth/VerifyOtpPage';

// Lazy load other pages for better performance
// import DashboardPage from '../pages/Dashboard/DashboardPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<MainPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      
      {/* Protected Routes */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <div>Dashboard (Coming Soon)</div>
          </ProtectedRoute>
        }
      />
      
      <Route
        path={ROUTES.BOOKING}
        element={
          <ProtectedRoute>
            <div>Booking (Coming Soon)</div>
          </ProtectedRoute>
        }
      />
      
      {/* Admin Routes */}
      <Route
        path={ROUTES.ADMIN}
        element={
          <ProtectedRoute requiredRole={['admin']}>
            <div>Admin (Coming Soon)</div>
          </ProtectedRoute>
        }
      />
      
      {/* 404 Not Found */}
      <Route path={ROUTES.NOT_FOUND} element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};
