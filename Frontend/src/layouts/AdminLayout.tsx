import { Outlet } from "react-router-dom";

import Header from "@/components/Admin/Header";
import SideBar from "@/components/Admin/Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <div className="fixed top-0 left-0 z-20 h-full w-64 border-r border-gray-200 bg-white">
        <SideBar />
      </div>

      {/* Khu vực nội dung chính */}
      <div className="flex flex-1 flex-col">
        <Header />

        <main className="ml-64 flex-1 overflow-y-auto p-6 pt-20 [scrollbar-gutter:stable]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
