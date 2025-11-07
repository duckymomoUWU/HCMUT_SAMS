import { Bell, LogOut } from "lucide-react";
import defaultAvatar from "@/assets/admin_avatar.jpg";

const userAvatar = "";
const userName = "Linh Nam"
const Header = () => { 
  return (
    <header
      className="
        fixed top-0 left-64 right-0 z-50
        flex items-center justify-between
        bg-white border-b border-gray-200
        px-6 py-3 shadow-sm
      "
    >
      {/* Greeting + Role */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-800">
          Xin chào, <span className="text-blue-600"> {userName}</span>
        </h1>
        <span className="text-sm text-gray-700">
          Vai trò:{" "}
          <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full font-medium">
            Quản trị viên
          </span>
        </span>
      </div>

      {/* Notification + Avatar + Logout */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <button className="relative hover:bg-gray-50 p-2 rounded-full transition">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Avatar */}
        <img
          src={userAvatar || defaultAvatar}
          alt="Admin avatar"
          className="w-8 h-8 rounded-full border object-cover"
        />

        {/* Logout */}
        <button
          onClick={() => console.log("Đăng xuất")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default Header;