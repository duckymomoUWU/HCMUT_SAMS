import { Outlet } from "react-router-dom";
import Header from "@/components/Admin/Header";
import SlideBar from "@/components/Admin/SlideBar";

const AdminLayout = () => {
  return (
    <div className="flex bg-[#f9fafb] min-h-screen">
      <div className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-20">
        <SlideBar />
      </div>

      {/* Khu vực nội dung chính */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main
          className="
            flex-1 ml-64 p-6 
            pt-20          /* chừa chỗ cho Header cao ~80px */
            overflow-y-auto
            [scrollbar-gutter:stable]
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
