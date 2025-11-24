import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  Package,
  ClipboardList,
  Users,
  UserCircle2,
} from "lucide-react";

const menu = [
  { name: "Tổng quan", path: "/admin", icon: <LayoutDashboard size={18} /> },
  {
    name: "Quản lý khung giờ",
    path: "/admin/timer-management",
    icon: <Clock size={18} />,
  },
  {
    name: "Quản lý thiết bị",
    path: "/admin/devices-management",
    icon: <Package size={18} />,
  },
  {
    name: "Quản lý đơn đặt",
    path: "/admin/orders-management",
    icon: <ClipboardList size={18} />,
  },
  {
    name: "Quản lý người dùng",
    path: "/admin/users-management",
    icon: <Users size={18} />,
  },
  { name: "Cài đặt", path: "/admin/setting", icon: <UserCircle2 size={18} /> },
];

const SideBar = () => {
  const location = useLocation();

  return (
    <aside className="fixed top-0 left-0 flex h-screen w-64 flex-col justify-between border-r border-gray-200 bg-white">
      {/* Logo */}
      <div>
        <div className="border-b border-gray-100 p-5">
          <h1 className="text-lg leading-tight font-bold text-blue-700">
            Sports Arena
          </h1>
          <p className="text-xs text-gray-500">HCMUT Management</p>
        </div>

        {/* Menu */}
        <nav className="mt-3 space-y-1">
          {menu.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-md px-4 py-2 text-sm transition-colors ${
                  active
                    ? "bg-blue-50 font-medium text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer info */}
      <div className="flex items-center gap-3 border-t border-gray-100 p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
          A
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">Quản trị viên</p>
          <p className="text-xs text-gray-500">admin@hcmut.edu.vn</p>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
