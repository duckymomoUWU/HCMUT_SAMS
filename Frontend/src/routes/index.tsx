import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "./routes";

// Public Pages
import MainPage from "@/pages/Home/MainPage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import VerifyOtpPage from "@/pages/Auth/VerifyOtpPage";

// Client Pages
import ClientDashboard from "../pages/Client/Dashboard";
import Booking from "../pages/Client/Booking";
import BookingHistory from "../pages/Client/BookingHistory";
import Profile from "../pages/Client/Profile";
import EquipmentRental from "../pages/Client/EquipmentRental";

// Admin Pages
import AdminDashboard from "../pages/Admin/Dashboard";
import Setting from "../pages/Admin/Setting";
import UsersManagement from "../pages/Admin/UsersManagement";
import DevicesManagement from "../pages/Admin/DevicesManagement";
import OrdersManagement from "../pages/Admin/OrdersManagement";
import TimerManagement from "../pages/Admin/TimerManagement";

// Layout
import AdminLayout from "@/layouts/AdminLayout";
import ClientLayout from "@/layouts/ClientLayout";

// Common
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.HOME} element={<MainPage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtpPage />} />

      {/* Client Routes */}
      <Route
        path={ROUTES.CLIENT}
        element={
          <ProtectedRoute requiredRole={["student"]}>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ClientDashboard />} />
        <Route path="booking" element={<Booking />} />
        <Route path="booking-history" element={<BookingHistory />} />
        <Route path="profile" element={<Profile />} />
        <Route path="equipment-rental" element={<EquipmentRental />} />
      </Route>

      {/* Admin Routes */}
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

      {/* 404 Not Found */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};
