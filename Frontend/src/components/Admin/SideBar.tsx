import {
  BarChart3,
  Calendar,
  Package,
  ClipboardList,
  Users,
  Settings,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import LogoHCMUT from "@/assets/hcmut_logo.png";

const menuItems = [
  { icon: BarChart3, label: "Tổng quan", path: "/admin" },
  {
    icon: Calendar,
    label: "Quản lí khung giờ",
    path: "/admin/timer-management",
  },
  {
    icon: Package,
    label: "Quản lí thiết bị",
    path: "/admin/devices-management",
  },
  {
    icon: ClipboardList,
    label: "Quản lí đơn đặt",
    path: "/admin/orders-management",
  },
  { icon: Users, label: "Quản lí người dùng", path: "/admin/users-management" },
  { icon: Settings, label: "Cài đặt", path: "/admin/setting" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {isOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-68 border-r-2 border-[gray] bg-[#d56c7e] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-[25px_15px_20px_25px]">
          <div className="mb-[76px] flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <div className="bg-dashboard-blue flex h-10 w-10 items-center justify-center rounded-lg">
                <img
                  src={LogoHCMUT}
                  alt="logo"
                  className="bg-blue-light w-[50px]"
                />
              </div>
              <div>
                <div className="text-base leading-[13px] font-normal text-black">
                  Sports Arena
                </div>
                <div className="text-dashboard-gray-text mt-[13px] text-base leading-[13px] font-normal">
                  HCMUT Manager
                </div>
              </div>
            </div>

            <button className="lg:hidden" onClick={onClose}>
              <X className="h-6 w-6 text-black" />
            </button>
          </div>

          <div className="mb-[26px] border-t border-[#979797]"></div>

          <nav className="space-y-[10px]">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-[25px] rounded-lg px-[18px] py-[2px] transition-colors ${
                    isActive
                      ? "bg-[#155dfc]"
                      : "hover:bg-opacity-50 hover:bg-[#006199]"
                  }`}
                >
                  <Icon className="h-6 w-6 text-black" />
                  <span className="text-base leading-[10px] font-normal text-black">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute right-0 bottom-0 left-0 p-[15px]">
          <div className="mb-[25px] border-t border-[rgba(151,151,151,0.8)]"></div>
          <div className="flex items-center gap-[11px]">
            <div className="h-10 w-10 rounded-full bg-[#D9D9D9]"></div>
            <div>
              <div className="mb-[18px] text-xl leading-[13px] font-normal text-black">
                Nguyễn Văn A
              </div>
              <div className="leading-[13px] font-normal text-[gray]">
                hello@hcmut.edu.vn
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
