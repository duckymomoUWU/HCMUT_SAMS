import { useState } from "react";
import Sidebar from "../../components/Admin/SideBar";
import Header from "../../components/Admin/Header";
import StatsCard from "../../components/Admin/StatsCard";
import {
  Search,
  Phone,
  Calendar,
  Check,
  Trash2,
  Users,
  UserCheck,
  UserX,
  TrendingUp,
} from "lucide-react";

type User = {
  id: number;
  name: string;
  initial: string;
  email: string;
  phone: string;
  joinDate: string;
  bookings: number;
  revenue: string;
  role: string;
  status: "active" | "blocked" | "inactive";
  penalties: number;
};

type StatusConfigType = {
  [key: string]: {
    bg: string;
    text: string;
    textColor: string;
  };
};

const users: User[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    initial: "N",
    email: "student2@hcmut.edu.vn",
    phone: "0123456789",
    joinDate: "07-07-2025",
    bookings: 12,
    revenue: "1800k",
    role: "Sinh viên",
    status: "active",
    penalties: 2,
  },
  {
    id: 2,
    name: "Trần Văn B",
    initial: "T",
    email: "student12@hcmut.edu.vn",
    phone: "0123456798",
    joinDate: "06-07-2025",
    bookings: 11,
    revenue: "1600k",
    role: "Sinh viên",
    status: "active",
    penalties: 0,
  },
  {
    id: 3,
    name: "Lê Thị C",
    initial: "L",
    email: "student3@hcmut.edu.vn",
    phone: "0123456799",
    joinDate: "05-07-2025",
    bookings: 13,
    revenue: "1900k",
    role: "Sinh viên",
    status: "blocked",
    penalties: 12,
  },
  {
    id: 4,
    name: "Phan Ngọc D",
    initial: "P",
    email: "student4@hcmut.edu.vn",
    phone: "0123456788",
    joinDate: "04-07-2025",
    bookings: 14,
    revenue: "1960k",
    role: "Sinh viên",
    status: "inactive",
    penalties: 2,
  },
  {
    id: 5,
    name: "Huỳnh Gia E",
    initial: "H",
    email: "admin@hcmut.edu.vn",
    phone: "0123456786",
    joinDate: "03-07-2025",
    bookings: 0,
    revenue: "0k",
    role: "Quản trị viên",
    status: "active",
    penalties: 0,
  },
];

const statusConfig: StatusConfigType = {
  active: {
    bg: "bg-[rgba(0,255,38,0.17)]",
    text: "Hoạt động",
    textColor: "text-[#0A5A28]",
  },
  blocked: {
    bg: "bg-[rgba(230,28,32,0.76)]",
    text: "Bị khóa",
    textColor: "text-white",
  },
  inactive: {
    bg: "bg-[#B7E0FF]",
    text: "Không hoạt động",
    textColor: "text-[#4005A0]",
  },
};

const UsersManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="min-h-screen bg-[#b7e63e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 transition-all lg:ml-68">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-6 h-16 rounded-lg bg-[#006199] p-4">
            <h1 className="mb-2 text-2xl leading-tight font-normal md:text-[28px] md:leading-[13px]">
              Quản lý người dùng
            </h1>
            <p className="text-xs text-white">
              Theo dõi và quản lý tài khoản người dùng trong hệ thống
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 border-[gray] sm:grid-cols-2 md:mb-8 md:gap-6 lg:grid-cols-4">
            <StatsCard
              title="Tổng người dùng"
              value="12"
              change="+2 từ tuần trước"
              changeType="positive"
              icon={
                <Users className="h-8 w-8 text-[#007be5] md:h-10 md:w-10" />
              }
            />

            <StatsCard
              title="Đang hoạt động"
              value="10"
              change="8/10 hoạt động"
              changeType="positive"
              icon={
                <UserCheck className="h-8 w-8 text-[green] md:h-10 md:w-10" />
              }
            />

            <StatsCard
              title="Bị khóa"
              value="1"
              change="1 tài khoản bị khóa"
              changeType="negative"
              icon={<UserX className="h-8 w-8 text-[red] md:h-10 md:w-10" />}
            />

            <StatsCard
              title="Tổng doanh thu"
              value="19,5M"
              change="+15%"
              changeType="positive"
              icon={
                <TrendingUp className="h-8 w-8 text-[purple] md:h-10 md:w-10" />
              }
            />
          </div>

          {/* Filter Section */}
          <div className="mb-6 rounded-[20px] border-2 bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <Search className="h-7 w-7 text-black" />
              <h2 className="text-2xl leading-[10px] font-normal text-black">
                Bộ lọc tìm kiếm
              </h2>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Search Input */}
              <div>
                <label className="mb-3 block text-xl font-semibold text-black">
                  Tìm kiếm
                </label>
                <input
                  type="text"
                  placeholder="Tên hoặc email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg bg-[#d9d9d9] px-4 py-3 text-base font-light text-black placeholder:font-normal placeholder:text-black focus:ring-2 focus:ring-[blue] focus:outline-none"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="mb-3 block text-xl font-semibold text-black">
                  Trạng thái
                </label>
                <select className="w-full appearance-none rounded-lg border border-black bg-white px-4 py-3 text-base font-medium text-black">
                  <option>Tất cả</option>
                  <option>Hoạt động</option>
                  <option>Không hoạt động</option>
                  <option>Bị khóa</option>
                </select>
              </div>

              {/* Role Filter */}
              <div>
                <label className="mb-3 block text-xl font-semibold text-black">
                  Vai trò
                </label>
                <select className="w-full appearance-none rounded-lg border border-black bg-white px-4 py-3 text-base font-medium text-black">
                  <option>Tất cả</option>
                  <option>Sinh viên</option>
                  <option>Quản trị viên</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex items-center rounded-xl bg-[#17A1FA] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1590e8]">
                <Search className="h-6 w-6" />
                Tìm kiếm
              </button>
              <button className="rounded-xl border border-black bg-white px-4 py-3 text-base font-semibold text-black transition-colors hover:bg-gray-50">
                Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="rounded-[20px] border border-[gray] bg-white p-6">
            <h2 className="mb-8 text-2xl leading-[10px] font-normal text-black">
              Danh sách người dùng ({users.length})
            </h2>

            <div className="space-y-4">
              {users.map((user) => {
                const statusStyle =
                  statusConfig[user.status as keyof typeof statusConfig];

                return (
                  <div
                    key={user.id}
                    className="rounded-xl border border-black p-6 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex flex-col items-start gap-4 lg:flex-row lg:items-center">
                      {/* Avatar and Name */}
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div className="flex h-[60px] w-[60px] flex-shrink-0 items-center justify-center rounded-full bg-[#007BE5]">
                          <span className="text-2xl font-semibold text-white">
                            {user.initial}
                          </span>
                        </div>
                        <div className="min-h[40px] min-w-[60px]">
                          <h3 className="mb-7 text-[20px] leading-[10px] font-normal text-black">
                            {user.name}
                          </h3>
                          <p className="text-base leading-[2px] font-light text-black">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Role Badge */}
                        <span
                          className={`rounded-lg px-2 py-1 text-xs leading-[10px] font-medium text-black ${
                            user.role === "Quản trị viên"
                              ? "bg-[#B7E0FF] text-[#4005A0]"
                              : "bg-[#d9d9dd]"
                          }`}
                        >
                          {user.role}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`rounded-lg px-2 py-1 text-xs leading-[10px] font-medium ${statusStyle.bg} ${statusStyle.textColor}`}
                        >
                          {statusStyle.text}
                        </span>

                        {/* Penalty Badge */}
                        {user.penalties > 0 && (
                          <span className="rounded-lg bg-[rgba(230,28,32,0.76)] px-2 py-1 text-xs leading-[10px] font-medium text-white">
                            {user.penalties} điểm phạt
                          </span>
                        )}
                      </div>

                      {/* Contact Info */}
                      <div className="flex flex-col gap-2 text-base font-light text-black">
                        <div className="flex items-center gap-2">
                          <Phone className="h-[17px] w-[17px]" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-[17px] w-[17px]" />
                          <span>Tham gia: {user.joinDate}</span>
                        </div>
                      </div>

                      {/* Bookings Info */}
                      <div className="flex items-center gap-2 text-base font-normal text-black">
                        <span>
                          {user.bookings} Booking • {user.revenue}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button className="rounded-xl border border-black bg-white px-2 py-2 text-base font-semibold text-black transition-colors hover:bg-gray-100">
                          Chi tiết
                        </button>
                        <button className="flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-black transition-colors hover:bg-gray-100">
                          <Check className="h-5 w-5 text-green-600" />
                        </button>
                        <button className="flex h-[34px] w-[34px] items-center justify-center rounded-xl bg-[red] transition-colors hover:bg-red-600">
                          <Trash2 className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UsersManagement;
