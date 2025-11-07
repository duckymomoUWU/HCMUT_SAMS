import { Outlet } from "react-router-dom";

import Header from "@/components/Client/Header";
import SlideBar from "@/components/Client/SlideBar";

const ClientLayout = () => {
  return (
    <div className="flex bg-[#f9fafb] min-h-screen">
      {/* Sidebar cố định bên trái */}
      <div className="fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 z-20">
        <SlideBar />
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col">
        {/* Header cố định */}
        <Header />

        {/* Phần nội dung có thể cuộn */}
        <main
          className="
            flex-1 ml-60 p-6 
            pt-20
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

export default ClientLayout;

 