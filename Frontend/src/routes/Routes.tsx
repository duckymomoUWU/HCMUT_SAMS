import { useRoutes } from "react-router-dom";

import MainPage from "@/pages/MainPage";
import ClientLayout from "@/layout/ClientLayout";
import AdminLayout from "@/layout/AdminLayout";

const Routes = () => {
  const elements = useRoutes([
    // Home route
    {
      path: "/",
      element: <MainPage />,
    },
    // Client route
    {
      path: "/client",
      element: <ClientLayout />,
      children: [
        {
          index: true,
          element: <div>Client Home</div>,
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
          element: <div>Admin Home</div>,
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
