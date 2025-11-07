import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Edit,
  Key,
  Link as LinkIcon,
} from "lucide-react";
import PageHeader from "@/components/Admin/PageHeader";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<
    "info" | "security" | "violations"
  >("info");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Mock user data
  const [userData, setUserData] = useState({
    name: "Nguyễn Văn A",
    email: "student@hcmut.edu.vn",
    phone: "0123456789",
    role: "Sinh viên",
    violations: 2,
    memberSince: "3 tháng",
    totalBookings: 12,
    equipmentRentals: 8,
  });

  // Store original user data for cancel functionality
  const [originalUserData, setOriginalUserData] = useState(userData);

  const violations = [
    {
      id: 1,
      type: "Trả dụng cụ muộn",
      description: "Trả vợt tennis muộn 3 ngày",
      date: "2024-09-20",
      points: 1,
      status: "Đang hiệu lực",
    },
    {
      id: 2,
      type: "Không check-out",
      description: "Quên check-out sau khi sử dụng sân",
      date: "2024-09-15",
      points: 1,
      status: "Đang hiệu lực",
    },
  ];

  const violationRules = [
    { points: 1, rule: "Trả dụng cụ muộn, quên check-out" },
    { points: 2, rule: "Hủy sân muộn (dưới 2 giờ), làm hỏng dụng cụ" },
    { points: 3, rule: "Không đến sân sau khi đặt (no-show)" },
    { points: 5, rule: "Vi phạm nghiêm trọng quy định sử dụng sân" },
  ];

  return (
    <div className="flex flex-col gap-8 pt-4">
      <PageHeader
        title="Hồ sơ cá nhân"
        subtitle="Quản lý thông tin tài khoản và cài đặt bảo mật"
      />

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("info")}
          className={`px-4 pb-3 font-medium transition ${
            activeTab === "info"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Thông tin cá nhân
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 pb-3 font-medium transition ${
            activeTab === "security"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Bảo mật
        </button>
        <button
          onClick={() => setActiveTab("violations")}
          className={`px-4 pb-3 font-medium transition ${
            activeTab === "violations"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Vi phạm ({userData.violations})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between text-black">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                  N
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {userData.name}
                  </h2>
                  <p className="text-sm text-gray-600">{userData.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {userData.role}
                    </span>
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                      {userData.violations} điểm phạt
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!isEditing) {
                    setOriginalUserData(userData);
                  }
                  setIsEditing(!isEditing);
                }}
                className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm text-[#000000] transition hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 text-[#000000]" />
                Chỉnh sửa
              </button>
            </div>

            <div className="border-t pt-6">
              <h3 className="mb-4 font-semibold text-gray-900">
                Thông tin cá nhân
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                Cập nhật thông tin liên hệ của bạn
              </p>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full rounded-md border bg-white py-2 pr-3 pl-9 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
                    <input
                      type="email"
                      value={userData.email}
                      disabled={!isEditing}
                      className="w-full rounded-md border bg-white py-2 pr-3 pl-9 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
                    <input
                      type="tel"
                      value={userData.phone}
                      disabled={!isEditing}
                      className="w-full rounded-md border bg-white py-2 pr-3 pl-9 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Vai trò
                  </label>
                  <div className="relative">
                    <Shield className="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      value={userData.role}
                      disabled
                      className="w-full rounded-md border bg-gray-50 py-2 pr-3 pl-9 text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setUserData(originalUserData);
                      setIsEditing(false);
                    }}
                    className="rounded-md border px-4 py-2 text-sm text-black transition hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Account Stats */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">
              Thông kê tài khoản
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-blue-50 p-4 text-center">
                <p className="text-3xl font-bold text-blue-700">
                  {userData.totalBookings}
                </p>
                <p className="mt-1 text-sm text-gray-700">Lần đặt sân</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-4 text-center">
                <p className="text-3xl font-bold text-purple-700">
                  {userData.equipmentRentals}
                </p>
                <p className="mt-1 text-sm text-gray-700">Lần mượn dụng cụ</p>
              </div>
              <div className="rounded-lg bg-red-50 p-4 text-center">
                <p className="text-3xl font-bold text-red-700">
                  {userData.violations}
                </p>
                <p className="mt-1 text-sm text-gray-700">Điểm phạt</p>
              </div>
              <div className="rounded-lg bg-green-50 p-4 text-center">
                <p className="text-3xl font-bold text-green-700">
                  {userData.memberSince}
                </p>
                <p className="mt-1 text-sm text-gray-700">Thành viên</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-6">
          {/* Change Password */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-gray-900">Đổi mật khẩu</h3>
            <p className="mb-4 text-sm text-gray-600">
              Cập nhật mật khẩu để bảo mật tài khoản
            </p>
            {!isChangingPassword ? (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                <Key className="h-4 w-4" />
                Đổi mật khẩu
              </button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="rounded-md border px-4 py-2 text-sm text-black transition hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      // Handle password change logic here
                      console.log("Changing password:", passwordData);
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Cập nhật mật khẩu
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Security Info */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">
              Thông tin bảo mật
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Xác thực 2 bước</p>
                    <p className="text-sm text-gray-600">
                      Tăng cường bảo mật cho tài khoản
                    </p>
                  </div>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Chưa kích hoạt
                </button>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Đăng nhập SSO</p>
                    <p className="text-sm text-gray-600">
                      Liên kết với tài khoản HCMUT
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-600">
                  Đã liên kết
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <LinkIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Phiên đăng nhập</p>
                    <p className="text-sm text-gray-600">
                      Quản lý các thiết bị đã đăng nhập
                    </p>
                  </div>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "violations" && (
        <div className="space-y-6">
          {/* Violation Summary */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">
              Tổng quan vi phạm
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-4xl font-bold text-red-700">
                  {userData.violations}
                </p>
                <p className="mt-1 text-sm text-gray-700">Tổng điểm phạt</p>
              </div>
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
                <p className="text-4xl font-bold text-yellow-700">2</p>
                <p className="mt-1 text-sm text-gray-700">Số lần vi phạm</p>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
                <p className="text-4xl font-bold text-green-700">8</p>
                <p className="mt-1 text-sm text-gray-700">Điểm còn lại</p>
              </div>
            </div>
          </div>

          {/* Violation History */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-gray-900">
              Lịch sử vi phạm
            </h3>
            <div className="space-y-3">
              {violations.map((violation) => (
                <div
                  key={violation.id}
                  className="flex items-center gap-3 rounded-lg border border-red-100 bg-red-50 p-4"
                >
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-600" />
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {violation.type}
                      </p>
                      <span className="rounded-full bg-red-200 px-2 py-0.5 text-xs font-medium text-red-800">
                        {violation.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {violation.description}
                    </p>
                    <p className="mt-1 text-xs text-gray-600">
                      <Calendar className="mr-1 inline h-3 w-3" />
                      {violation.date} • {violation.points} điểm phạt
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Violation Rules */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-gray-900">
              Quy định về vi phạm
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Các mức phạt sẽ được áp dụng theo quy định sau:
            </p>
            <ul className="space-y-2 text-sm text-gray-800">
              {violationRules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="min-w-[80px] font-semibold text-red-600">
                    • {rule.points} điểm phạt:
                  </span>
                  <span>{rule.rule}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
              <p className="text-sm text-yellow-800">
                <strong>Lưu ý:</strong> Khóa tài khoản khi tích lũy từ 10 điểm
                phạt (thời gian khóa: 14 ngày)
              </p>
            </div>
            <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                • Điểm phạt sẽ được xóa sau 6 tháng nếu không có vi phạm mới
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
