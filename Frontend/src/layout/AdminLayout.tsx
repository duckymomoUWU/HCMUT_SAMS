import { Outlet } from "react-router-dom";

import Header from "@/components/Admin/Header";
import SlideBar from "@/components/Admin/SlideBar";

const AdminLayout = () => {
  return (
    <div className="">
      <SlideBar />
      <div className="">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
