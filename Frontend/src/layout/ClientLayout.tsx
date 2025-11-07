import { Outlet } from "react-router-dom";

import Header from "@/components/Client/Header";
import SlideBar from "@/components/Client/SlideBar";
import { useInactivityLogout } from '../hooks/useInactivityLogout';

const ClientLayout = () => {
  // Tự động logout sau 30 giây không hoạt động
  useInactivityLogout(30 * 1000);

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {/* Sidebar cố định bên trái */}
      <div className="fixed top-0 left-0 z-20 h-full w-64 border-r border-gray-200 bg-white">
        <SlideBar />
      </div>

      {/* Nội dung chính */}
      <div className="flex flex-1 flex-col">
        {/* Header cố định */}
        <Header />

        <main className="ml-64 flex-1 overflow-y-auto p-6 pt-20 [scrollbar-gutter:stable]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
