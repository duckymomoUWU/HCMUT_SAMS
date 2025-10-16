import { Outlet } from "react-router-dom";

import Header from "@/components/Client/Header";
import SlideBar from "@/components/Client/SlideBar";

const ClientLayout = () => {
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

export default ClientLayout;
