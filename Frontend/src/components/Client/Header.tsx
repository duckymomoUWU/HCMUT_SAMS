import { useState } from "react";
import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "@/services/authService";
import defaultAvatar from "@/assets/hcmut_logo.png";

const Header = () => {
  const navigate = useNavigate();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  
  // Lấy user info từ authService
  const user = authService.getCurrentUser();
  const userName = user?.fullName || "Người dùng";
  const userAvatar = user?.avatarUrl || "";

  // Logout function
  const handleLogout = () => {
    authService.logout(); // Xóa token và user data
    setShowConfirmLogout(false);
    navigate("/login"); // Redirect về login
  };

  return (
    <header className="fixed top-0 right-0 left-64 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-sm">
      {/* Greeting + Role */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-800">
          Xin chào, <span className="text-blue-600"> {userName} </span>
        </h1>
        <span className="text-sm text-gray-700">
          Vai trò:{" "}
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            Người dùng
          </span>
        </span>
      </div>

      {/* Notification + Avatar + Logout */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <button className="relative rounded-full p-2 transition hover:bg-gray-50">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* Avatar */}
        <img
          src={userAvatar || defaultAvatar}
          alt="User avatar"
          className="h-8 w-8 rounded-full border object-cover"
        />

        {/* Logout */}
        <button
          onClick={() => setShowConfirmLogout(true)}
          className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-red-600"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>

      {/* Modal xác nhận đăng xuất */}
      {showConfirmLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative w-[450px] rounded-xl bg-white p-6 shadow-lg">
            <h3 className="mb-1 text-lg font-semibold text-gray-800">
              Xác nhận đăng xuất
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="rounded-md border px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
