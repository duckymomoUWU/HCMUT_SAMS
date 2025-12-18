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
  { name: "Đặt sân", path: "/client/booking", icon: <CalendarClock size={18} /> },
  { name: "Lịch sử đặt sân", path: "/client/court-booking-history", icon: <MapPin size={18} /> },
  { name: "Thuê thiết bị", path: "/client/equipment-rental", icon: <Package size={18} /> },
  { name: "Lịch sử thuê đồ", path: "/client/booking-history", icon: <History size={18} /> },
  { name: "Hồ sơ cá nhân", path: "/client/profile", icon: <UserCircle2 size={18} /> },
];

const SlideBar = () => { 
  const location = useLocation();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
      {/* Logo */}
      <div>
        <div className="p-5 border-b border-gray-100">
          <h1 className="text-lg font-bold text-blue-700 leading-tight">
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
                className={`flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-600 font-medium"
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
      <div className="p-4 border-t border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          A
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">Bro</p>
          <p className="text-xs text-gray-500">student@hcmut.edu.vn</p>
        </div>
      </div>
    </aside>
  );
};

export default SlideBar;