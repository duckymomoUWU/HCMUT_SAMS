import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarClock,
  Package,
  History,
  UserCircle2,
  MapPin,
} from "lucide-react";

const menu = [
  { name: "Tổng quan", path: "/client", icon: <LayoutDashboard size={18} /> },
  {
    name: "Đặt sân",
    path: "/client/booking",
    icon: <CalendarClock size={18} />,
  },
  {
    name: "Lịch sử đặt sân",
    path: "/client/court-booking-history",
    icon: <MapPin size={18} />,
  },
  {
    name: "Thuê thiết bị",
    path: "/client/equipment-rental",
    icon: <Package size={18} />,
  },
  {
    name: "Lịch sử thuê đồ",
    path: "/client/booking-history",
    icon: <History size={18} />,
  },
  {
    name: "Hồ sơ cá nhân",
    path: "/client/profile",
    icon: <UserCircle2 size={18} />,
  },
];

interface User {
  avatarUrl: string;
  email: string;
  fullName: string;
  id: string;
  role?: string;
}

const SlideBar = () => {
  const location = useLocation();

  // Get user from localStorage
  const userRaw = localStorage.getItem("user");
  const user: User | null = userRaw ? JSON.parse(userRaw) : null;

  return (
    <aside className="fixed top-0 left-0 flex h-screen w-64 flex-col justify-between border-r border-gray-200 bg-white">
      {/* Logo */}
      <div>
        <div className="border-b border-gray-100 p-5">
          <h1 className="text-lg leading-tight font-bold text-blue-700">
            Sports Arena
          </h1>
          <p className="text-xs text-gray-500">HCMUT Booking</p>
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
          <img src={user?.avatarUrl} alt="" className="rounded-full" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">
            {user?.fullName || "Student"}
          </p>
          <p className="text-xs text-gray-500">
            {user?.email || "student.hcmut.edu.vn"}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default SlideBar;
