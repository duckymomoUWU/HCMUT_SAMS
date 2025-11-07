import React, { useState } from "react";
import PageHeader from "@/components/Admin/PageHeader";
import {
  User,
  Mail,
  Phone,
  Search,
  UserCheck,
  UserX,
  ChevronDown,
} from "lucide-react";
import StatCard from "@/components/Admin/StatCard";


type UserRole = "Sinh viên" | "Quản trị viên" | "Giảng viên";
type UserStatus = "Hoạt động" | "Không hoạt động" | "Bị khóa";

interface AppUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  joinDate: string;
  bookings: number;
  penalty?: number;
}

const SAMPLE_USERS: AppUser[] = [
  {
    id: "u1",
    name: "Nguyễn Văn A",
    email: "student2@hcmut.edu.vn",
    phone: "0123456789",
    role: "Sinh viên",
    status: "Hoạt động",
    joinDate: "07-07-2025",
    bookings: 12,
    penalty: 2,
  },
  {
    id: "u2",
    name: "Trần Văn B",
    email: "student12@hcmut.edu.vn",
    phone: "0123456798",
    role: "Sinh viên",
    status: "Hoạt động",
    joinDate: "06-07-2025",
    bookings: 11,
  },
  {
    id: "u3",
    name: "Lê Thị C",
    email: "student3@hcmut.edu.vn",
    phone: "0123456799",
    role: "Sinh viên",
    status: "Bị khóa",
    joinDate: "05-07-2025",
    bookings: 13,
    penalty: 12,
  },
  {
    id: "u4",
    name: "Phan Ngọc D",
    email: "student4@hcmut.edu.vn",
    phone: "0123456783",
    role: "Sinh viên",
    status: "Không hoạt động",
    joinDate: "04-07-2025",
    bookings: 14,
  },
  {
    id: "u5",
    name: "Huỳnh Gia E",
    email: "admin@hcmut.edu.vn",
    phone: "0123456785",
    role: "Quản trị viên",
    status: "Hoạt động",
    joinDate: "03-07-2025",
    bookings: 0,
  },
];

const UsersManagement: React.FC = () => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | UserStatus>("all");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");

  const stats = [
    {
      id: 1,
      title: "Tổng người dùng",
      value: String(SAMPLE_USERS.length),
      color: "text-blue-600",
      icon: (
        <div className="p-2 bg-blue-50 rounded-lg">
          <User className="w-5 h-5 text-blue-600" />
        </div>
      ),
    },
    {
      id: 2,
      title: "Đang hoạt động",
      value: String(SAMPLE_USERS.filter((u) => u.status === "Hoạt động").length),
      color: "text-green-600",
      icon: (
        <div className="p-2 bg-green-50 rounded-lg">
          <UserCheck className="w-5 h-5 text-green-600" />
        </div>
      ),
    },
    {
      id: 3,
      title: "Bị khóa",
      value: String(SAMPLE_USERS.filter((u) => u.status === "Bị khóa").length),
      color: "text-red-600",
      icon: (
        <div className="p-2 bg-red-50 rounded-lg">
          <UserX className="w-5 h-5 text-red-600" />
        </div>
      ),
    },
    {
      id: 4,
      title: "Tổng doanh thu",
      value: "19,5M",
      color: "text-indigo-600",
      icon: (
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Mail className="w-5 h-5 text-indigo-600" />
        </div>
      ),
    },
  ];

  const filtered = SAMPLE_USERS.filter((u) => {
    const q = query.trim().toLowerCase();
    if (
      q &&
      !(
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone ?? "").includes(q)
      )
    )
      return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-8 pt-4">
      <PageHeader
        title="Quản lý người dùng"
        subtitle="Theo dõi và quản lý tài khoản người dùng"
      />
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((s) => (
          <StatCard
            key={s.id}
            title={s.title}
            value={s.value}
            colorClass={s.color}
            icon={s.icon}
          />
        ))}
      </div>

      {/* Bộ lọc tìm kiếm */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-600" /> Bộ lọc tìm kiếm
        </h3>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tên hoặc email..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Không hoạt động">Không hoạt động</option>
            <option value="Bị khóa">Bị khóa</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="Sinh viên">Sinh viên</option>
            <option value="Quản trị viên">Quản trị viên</option>
            <option value="Giảng viên">Giảng viên</option>
          </select>

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => {
                setQuery("");
                setRoleFilter("all");
                setStatusFilter("all");
              }}
              className="px-4 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Xóa bộ lọc
            </button>
            <button className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách người dùng */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-800 mb-3">
          Danh sách người dùng ({filtered.length})
        </h3>

        <div className="space-y-3">
          {filtered.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                  {u.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(-2)
                    .join("")}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-800 truncate">{u.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {u.role}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        u.status === "Hoạt động"
                          ? "bg-green-100 text-green-700"
                          : u.status === "Bị khóa"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1 flex flex-wrap gap-3">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-400" /> {u.email}
                    </span>
                    {u.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-gray-400" /> {u.phone}
                      </span>
                    )}
                    <span>Tham gia: {u.joinDate}</span>
                    <span>{u.bookings} lần đặt</span>
                    {typeof u.penalty === "number" && (
                      <span className="text-red-600">
                        · {u.penalty} điểm phạt
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
                  Chi tiết
                </button>
                <button className="p-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-6">
              Không có người dùng phù hợp.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
