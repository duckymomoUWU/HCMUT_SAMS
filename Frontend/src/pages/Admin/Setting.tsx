import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Key,
  Eye,
  EyeOff,
  Activity,
  Calendar,
  Settings,
} from "lucide-react";
import StatCard from "@/components/Admin/StatCard";
import PageHeader from "@/components/Admin/PageHeader";

const AdminSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "Nguyễn Văn Admin",
    email: "admin@hcmut.edu.vn",
    phone: "0123456789",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const stats = [
    {
      id: 1,
      title: "Booking đã quản lý",
      value: "234",
      colorClass: "text-blue-600",
      icon: (
        <div className="p-2 bg-blue-50 rounded-lg">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
      ),
    },
    {
      id: 2,
      title: "Người dùng trong hệ thống",
      value: "156",
      colorClass: "text-indigo-600",
      icon: (
        <div className="p-2 bg-indigo-50 rounded-lg">
          <User className="w-5 h-5 text-indigo-600" />
        </div>
      ),
    },
    {
      id: 3,
      title: "Loại thiết bị",
      value: "7",
      colorClass: "text-green-600",
      icon: (
        <div className="p-2 bg-green-50 rounded-lg">
          <Shield className="w-5 h-5 text-green-600" />
        </div>
      ),
    },
    {
      id: 4,
      title: "Uptime hệ thống",
      value: "99.8%",
      colorClass: "text-yellow-600",
      icon: (
        <div className="p-2 bg-yellow-50 rounded-lg">
          <Settings className="w-5 h-5 text-yellow-600" />
        </div>
      ),
    },
  ];

  const handleSave = () => {
    alert("Cập nhật thông tin thành công!");
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    alert("Đổi mật khẩu thành công!");
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="flex flex-col gap-8 pt-4">
      {/* Header */}
      <PageHeader
        title="Cài đặt quản trị viên"
        subtitle="Quản lý thông tin cá nhân và cấu hình hệ thống"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((s) => (
          <StatCard
            key={s.id}
            title={s.title}
            value={s.value}
            colorClass={s.colorClass}
            icon={s.icon}
          />
        ))}
      </div>

      {/* Thông tin cá nhân */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <User size={18} className="text-gray-600" />
            Thông tin cá nhân
          </h2>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`px-3 py-1.5 rounded-md text-sm border transition ${
              isEditing
                ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                : "text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {isEditing ? "Lưu" : "Chỉnh sửa"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            icon={<User className="w-4 h-4 text-gray-400" />}
            label="Họ và tên"
            value={formData.name}
            onChange={(v) => setFormData({ ...formData, name: v })}
            disabled={!isEditing}
          />
          <InputField
            icon={<Mail className="w-4 h-4 text-gray-400" />}
            label="Email"
            value={formData.email}
            onChange={(v) => setFormData({ ...formData, email: v })}
            disabled={!isEditing}
          />
          <InputField
            icon={<Phone className="w-4 h-4 text-gray-400" />}
            label="Số điện thoại"
            value={formData.phone}
            onChange={(v) => setFormData({ ...formData, phone: v })}
            disabled={!isEditing}
          />
          <InputField
            icon={<Shield className="w-4 h-4 text-gray-400" />}
            label="Vai trò"
            value="Quản trị viên"
            disabled
          />
        </div>
      </div>

      {/* Đổi mật khẩu */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Key size={18} className="text-gray-600" />
          Đổi mật khẩu
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { key: "currentPassword", label: "Mật khẩu hiện tại" },
            { key: "newPassword", label: "Mật khẩu mới" },
            { key: "confirmPassword", label: "Xác nhận mật khẩu mới" },
          ].map((f) => (
            <PasswordField
              key={f.key}
              label={f.label}
              value={(formData as any)[f.key]}
              onChange={(v) => setFormData({ ...formData, [f.key]: v })}
              showPassword={showPassword}
              toggleShow={() => setShowPassword((p) => !p)}
            />
          ))}
        </div>

        <button
          onClick={handleChangePassword}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          Đổi mật khẩu
        </button>
      </div>

      {/* Lịch sử hoạt động */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Activity size={18} className="text-gray-600" />
          Lịch sử hoạt động
        </h2>

        <div className="space-y-3">
          {[
            {
              icon: <Settings size={16} className="text-purple-600" />,
              title: "Cập nhật cài đặt hệ thống",
              time: "2 ngày trước",
            },
            {
              icon: <Calendar size={16} className="text-green-600" />,
              title: "Duyệt đơn đặt sân #BK005",
              time: "4 giờ trước",
            },
            {
              icon: <User size={16} className="text-yellow-600" />,
              title: "Quản lý tài khoản sinh viên",
              time: "1 ngày trước",
            },
          ].map((a) => (
            <div
              key={a.title}
              className="flex items-center gap-3 border border-gray-100 rounded-lg p-3 hover:bg-gray-50"
            >
              {a.icon}
              <div>
                <p className="font-medium text-gray-800">{a.title}</p>
                <p className="text-xs text-gray-500">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cài đặt hệ thống */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <Settings size={18} className="text-gray-600" />
          Cài đặt hệ thống
        </h2>

        <div className="space-y-4">
          {[
            {
              label: "Thông báo email",
              desc: "Nhận thông báo qua email",
              checked: true,
            },
            {
              label: "Tự động duyệt booking",
              desc: "Duyệt đơn hợp lệ tự động",
              checked: false,
            },
            {
              label: "Backup dữ liệu hàng ngày",
              desc: "Tự động lưu trữ dữ liệu mỗi ngày",
              checked: true,
            },
          ].map((s, i) => (
            <div
              key={i}
              className="flex justify-between items-center border border-gray-100 rounded-lg p-3 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-gray-800">{s.label}</p>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={s.checked}
                className="w-4 h-4 accent-blue-600 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const InputField = ({ icon, label, value, onChange, disabled }: InputFieldProps) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <div className="relative mt-1">
      <div className="absolute left-3 top-2.5">{icon}</div>
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full pl-9 pr-3 py-2 text-sm border rounded-md ${
          disabled
            ? "bg-gray-50 text-gray-600 border-gray-200"
            : "bg-white text-gray-800 border-gray-300 focus:ring-1 focus:ring-blue-500"
        }`}
      />
    </div>
  </div>
);

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  toggleShow: () => void;
}

const PasswordField = ({
  label,
  value,
  onChange,
  showPassword,
  toggleShow,
}: PasswordFieldProps) => (
  <div>
    <label className="text-sm text-gray-600">{label}</label>
    <div className="relative mt-1">
      <Key className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-10 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-800 focus:ring-1 focus:ring-blue-500"
      />
      <button
        type="button"
        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
        onClick={toggleShow}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  </div>
);
export default AdminSettings;
