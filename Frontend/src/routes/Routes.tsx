import { useRoutes } from "react-router-dom";

import MainPage from "@/pages/MainPage";

import SignInPage from "@/pages/SignInPage";

import ClientLayout from "@/layout/ClientLayout";
import Booking from "@/pages/Client/Booking";
import BookingHistory from "@/pages/Client/BookingHistory";
import Profile from "@/pages/Client/Profile";
import EquipmentRental from "@/pages/Client/EquipmentRental";
import DashboardClient from "@/pages/Client/Dashboard";

import AdminLayout from "@/layout/AdminLayout";
import DashboardAdmin from "@/pages/Admin/Dashboard";
import Setting from "@/pages/Admin/Setting";
import UsersManagement from "@/pages/Admin/UsersManagement";
import DevicesManagement from "@/pages/Admin/DevicesManagement";
import OrdersManagement from "@/pages/Admin/OrdersManagement";
import TimerManagement from "@/pages/Admin/TimerManagement";
import SignUpPage from "@/pages/SignUpPage";
import Test from "@/pages/Test";

const Routes = () => {
  const elements = useRoutes([
    // Main route
    {
      path: "/",
      element: <MainPage />,
    },
    // Sign in route
    {
      path: "/sign-in",
      element: <SignInPage />,
    },
    // Sign up route
    {
      path: "/sign-up",
      element: <SignUpPage />,
    },
    {
      path: "/test",
      element: <Test />,
    },
    // Client route
    {
      path: "/client",
      element: <ClientLayout />,
      children: [
        {
          index: true,
          element: <DashboardClient />,
        },
        {
          path: "booking",
          element: <Booking />,
        },
        {
          path: "booking-history",
          element: <BookingHistory />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "equipment-rental",
          element: <EquipmentRental />,
        },
      ],
    },
    // Admin route
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <DashboardAdmin />,
        },
        {
          path: "setting",
          element: <Setting />,
        },
        {
          path: "users-management",
          element: <UsersManagement />,
        },
        {
          path: "devices-management",
          element: <DevicesManagement />,
        },
        {
          path: "orders-management",
          element: <OrdersManagement />,
        },
        {
          path: "timer-management",
          element: <TimerManagement />,
        },
      ],
    },
    // Wrong route
    {
      path: "*",
      element: <div>404</div>,
    },
  ]);

  return elements;
};

export default Routes;
