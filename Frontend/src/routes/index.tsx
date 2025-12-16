import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { ProtectedRoute } from "./ProtectedRoute";

// Layouts
import ClientLayout from "../layout/ClientLayout";
import AdminLayout from "../layout/AdminLayout";

// Public Pages
import MainPage from "../pages/HomePage/MainPage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import VerifyOtpPage from "../pages/Auth/VerifyOtpPage";

// Client Pages
import ClientDashboard from "../pages/Client/Dashboard";
import Booking from "../pages/Client/Booking";
import BookingHistory from "../pages/Client/BookingHistory";
import Profile from "../pages/Client/Profile";
import EquipmentRental from "../pages/Client/EquipmentRental";

// Payment Pages
import Payment from "../pages/Payment/PaymentResultPage";
import PaymentResultPage from '../pages/Payment/PaymentResultPage';

// Admin Pages
import AdminDashboard from "../pages/Admin/Dashboard";
import Setting from "../pages/Admin/Setting";
import UsersManagement from "../pages/Admin/UsersManagement";
import DevicesManagement from "../pages/Admin/DevicesManagement";
import OrdersManagement from "../pages/Admin/OrdersManagement";
import TimerManagement from "../pages/Admin/TimerManagement";

// test
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<MainPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtpPage />} />
      <Route path="/signin" element={<SignInPage />} />

      <Route path='/signup' element={<SignUpPage />} />
      
      {/* Payment Result Route - Public (VNPay callback) */}
      <Route path="/payment/result" element={<PaymentResultPage />} />
      

      {/* Client Routes - Protected (Student Only) */}
      <Route
        path="/client"
        element={
          // <ProtectedRoute requiredRole={['student']}>
          <ClientLayout />
          // </ProtectedRoute>
        }
      >
        <Route index element={<ClientDashboard />} />
        <Route path="booking" element={<Booking />} />
        <Route path="booking-history" element={<BookingHistory />} />
        <Route path="profile" element={<Profile />} />
        <Route path="equipment-rental" element={<EquipmentRental />} />
        <Route path="payment" element={<Payment />} />
      </Route>

      {/* Admin Routes - Protected with Admin Role */}
      <Route
        path={ROUTES.ADMIN}
        element={
          <ProtectedRoute requiredRole={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="setting" element={<Setting />} />
        <Route path="users-management" element={<UsersManagement />} />
        <Route path="devices-management" element={<DevicesManagement />} />
        <Route path="orders-management" element={<OrdersManagement />} />
        <Route path="timer-management" element={<TimerManagement />} />
      </Route>

      {/* Legacy Routes - Redirect for backward compatibility */}
      <Route path="/sign-in" element={<Navigate to={ROUTES.LOGIN} replace />} />
      <Route
        path="/sign-up"
        element={<Navigate to={ROUTES.REGISTER} replace />}
      />
      <Route
        path={ROUTES.DASHBOARD}
        element={<Navigate to="/client" replace />}
      />

      {/* 404 Not Found */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};
