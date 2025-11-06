import { useState } from "react";
import Sidebar from "../../components/Admin/SideBar";
import Header from "../../components/Admin/Header";
import StatsCard from "../../components/Admin/StatsCard";
import {
  Search,
  Calendar,
  TrendingUp,
  Clock,
  FileText,
  Package,
  Wallet2,
  User,
  Eye,
  Ban,
  Footprints,
} from "lucide-react";

type Booking = {
  id: string;
  name: string;
  court: string;
  date: string;
  time: string;
  amount: string;
  status: "Đã xác nhận" | "Chờ thanh toán" | "Hoàn thành" | "Không đến";
  checkin?: string;
  checkout?: string;
};

const OrdersManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  const bookings: Booking[] = [
    {
      id: "BK232323",
      name: "Nguyễn Văn A",
      court: "Sân Tennis - A1",
      date: "23/12/2025",
      time: "7:00 - 9:30",
      amount: "100.000đ",
      status: "Đã xác nhận",
    },
    {
      id: "BK232324",
      name: "Nguyễn Văn A",
      court: "Sân Tennis - A1",
      date: "23/12/2025",
      time: "7:00 - 9:30",
      amount: "100.000đ",
      status: "Không đến",
    },
    {
      id: "BK232325",
      name: "Nguyễn Văn A",
      court: "Sân Tennis - A1",
      date: "23/12/2025",
      time: "7:00 - 9:30",
      amount: "100.000đ",
      status: "Hoàn thành",
      checkin: "7:15",
      checkout: "9:25",
    },
  ];

  const filtered = bookings.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#b7e63e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 transition-all lg:ml-68">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-6 h-16 rounded-lg bg-[#006199] p-4">
            <h1 className="mb-2 text-2xl leading-tight font-normal md:text-[28px] md:leading-[13px]">
              Quản lý đơn đặt
            </h1>
            <p className="text-xs text-white">
              Theo dõi và quản lý tất cả các đơn đặt trong hệ thống
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 border-[gray] sm:grid-cols-2 md:mb-8 md:gap-6 lg:grid-cols-4">
            <StatsCard
              title="Tổng đơn đặt"
              value="4"
              change="+1 từ tuần trước"
              changeType="positive"
              icon={
                <FileText className="h-8 w-8 text-[#007be5] md:h-10 md:w-10" />
              }
            />

            <StatsCard
              title="Đã xác nhận"
              value="1"
              change="1/4 đã xác nhận"
              changeType="positive"
              icon={
                <Package className="h-8 w-8 text-[green] md:h-10 md:w-10" />
              }
            />

            <StatsCard
              title="Chờ thanh toán"
              value="1"
              change="1 đơn chờ"
              changeType="positive"
              icon={
                <Wallet2 className="h-8 w-8 text-[yellow] md:h-10 md:w-10" />
              }
            />

            <StatsCard
              title="Doanh thu"
              value="180.000đ"
              change="+10%"
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
                  placeholder="Mã booking, tên người dùng..."
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
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-black bg-white px-4 py-3 text-base font-medium text-black"
                >
                  <option>Tất cả</option>
                  <option>Đã xác nhận</option>
                  <option>Chờ thanh toán</option>
                  <option>Hoàn thành</option>
                  <option>Không đến</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="mb-3 block text-xl font-semibold text-black">
                  Ngày
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg bg-[#d9d9d9] px-4 py-3 text-base font-light text-black focus:ring-2 focus:ring-[blue] focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex items-center rounded-xl bg-[#17A1FA] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1590e8]">
                <Search className="h-6 w-6" />
                Tìm kiếm
              </button>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("Tất cả");
                }}
                className="rounded-xl border border-black bg-white px-4 py-3 text-base font-semibold text-black transition-colors hover:bg-gray-50"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Danh sách đơn */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-base font-semibold text-gray-800">
              Danh sách đơn đặt
            </h2>
            <p className="mb-4 text-sm text-gray-500">
              Theo dõi tình trạng mượn/trả dụng cụ
            </p>

            <div className="space-y-3">
              {filtered.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
                >
                  <div>
                    {/* Header ID + Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-gray-800">{it.id}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          it.status === "Đã xác nhận"
                            ? "bg-green-100 text-green-700"
                            : it.status === "Hoàn thành"
                              ? "bg-blue-100 text-blue-700"
                              : it.status === "Chờ thanh toán"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {it.status}
                      </span>
                      <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                        Đã thanh toán
                      </span>
                      {it.status === "Không đến" && (
                        <Ban className="ml-1 h-4 w-4 text-red-500" />
                      )}
                    </div>

                    {/* Details */}
                    <p className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <User size={14} /> {it.name}
                      <Package size={14} /> {it.court}
                      <Calendar size={14} /> {it.date}
                      <Clock size={14} /> {it.time}
                    </p>

                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Wallet2 size={14} /> {it.amount}
                    </p>

                    {it.checkin && (
                      <p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <Footprints size={13} className="text-gray-600" />{" "}
                        Checkin: {it.checkin} — Checkout: {it.checkout}
                      </p>
                    )}
                  </div>

                  <button className="rounded-md bg-gray-100 p-2 transition hover:bg-blue-100">
                    <Eye className="h-5 w-5 text-gray-700 hover:text-blue-700" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersManagement;
