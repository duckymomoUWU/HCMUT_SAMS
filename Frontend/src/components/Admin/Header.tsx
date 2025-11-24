import { Bell, LogOut } from "lucide-react";
import defaultAvatar from "@/assets/admin_avatar.jpg";

const userAvatar = "";

const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-64 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
      {/* 👋 Greeting + Role */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-800">
          Xin chào, <span className="text-blue-600">Quản trị viên</span>
        </h1>
        <span className="text-sm text-gray-700">
          Vai trò:{" "}
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            Quản trị viên
          </span>
        </span>
      </div>

      {/* 🔔 Notification + Avatar + Logout */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <button className="relative rounded-full p-2 transition hover:bg-gray-50">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Avatar */}
        <img
          src={userAvatar || defaultAvatar}
          alt="Admin avatar"
          className="h-8 w-8 rounded-full border object-cover"
        />

        {/* Logout */}
        <button
          onClick={() => console.log("Đăng xuất")}
          className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-red-600"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default Header;
