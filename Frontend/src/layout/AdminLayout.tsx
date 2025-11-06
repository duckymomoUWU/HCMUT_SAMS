import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="bg-dashboard-bg-main flex min-h-screen bg-[#51A4F1]">
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
