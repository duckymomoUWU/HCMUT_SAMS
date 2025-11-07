import { useState } from "react";
import PageHeader from "@/components/Admin/PageHeader";
import {
  Calendar,
  Clock,
  FileText,
  Search,
  Package,
  Wallet2,
  User,
  Eye,
  Ban,
  Footprints,
} from "lucide-react";
import StatCard from "@/components/Admin/StatCard";

interface Booking {
  id: string;
  name: string;
  court: string;
  date: string;
  time: string;
  amount: string;
  status: "Đã xác nhận" | "Chờ thanh toán" | "Hoàn thành" | "Không đến";
  checkin?: string;
  checkout?: string;
}

const OrdersManagement = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");

  const stats = [
    {
      id: 1,
      title: "Tổng đơn đặt",
      value: "4",
      color: "text-blue-600",
      icon: (
        <div className="p-2 bg-blue-50 rounded-lg">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
      ),
    },
    {
      id: 2,
      title: "Đã xác nhận",
      value: "1",
      color: "text-green-600",
      icon: (
        <div className="p-2 bg-green-50 rounded-lg">
          <Package className="w-5 h-5 text-green-600" />
        </div>
      ),
    },
    {
      id: 3,
      title: "Chờ thanh toán",
      value: "1",
      color: "text-yellow-600",
      icon: (
        <div className="p-2 bg-yellow-50 rounded-lg">
          <Wallet2 className="w-5 h-5 text-yellow-600" />
        </div>
      ),
    },
    {
      id: 4,
      title: "Doanh thu",
      value: "180.000đ",
      color: "text-indigo-600",
      icon: (
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Wallet2 className="w-5 h-5 text-indigo-600" />
        </div>
      ),
    },
  ];

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

  const filtered = bookings.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
         
        <PageHeader
          title="Quản lý đơn đặt"
          subtitle="Theo dõi và quản lý tất cả các đơn đặt trong hệ thống"
        />
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition">
          <FileText className="w-4 h-4" /> Xuất báo cáo
        </button>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item) => (
          <StatCard
            key={item.id}
            title={item.title}
            value={item.value}
            colorClass={item.color}
            icon={item.icon}
          />
        ))}
      </div>

      {/* Bộ lọc tìm kiếm */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-600" /> Bộ lọc tìm kiếm
        </h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">Tìm kiếm</label>
            <input
              type="text"
              placeholder="Mã booking, tên người dùng, sân..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-48 bg-white focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option>Tất cả</option>
              <option>Đã xác nhận</option>
              <option>Chờ thanh toán</option>
              <option>Hoàn thành</option>
              <option>Không đến</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">Ngày</label>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
          </div>

          <div className="flex gap-2 ml-auto">
            <button className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 flex items-center gap-2">
              <Search size={14} /> Tìm kiếm
            </button>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("Tất cả");
              }}
              className="text-sm border border-gray-300 px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách đơn */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-1">
          Danh sách đơn đặt
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Theo dõi tình trạng mượn/trả dụng cụ
        </p>

        <div className="space-y-3">
          {filtered.map((it) => (
            <div
              key={it.id}
              className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div>
                {/* Header ID + Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-gray-800">{it.id}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
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
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-600 border border-green-200">
                    Đã thanh toán
                  </span>
                  {it.status === "Không đến" && (
                    <Ban className="w-4 h-4 text-red-500 ml-1" />
                  )}
                </div>

                {/* Details */}
                <p className="text-sm text-gray-600 flex items-center gap-3 mt-1 flex-wrap">
                  <User size={14} /> {it.name}
                  <Package size={14} /> {it.court}
                  <Calendar size={14} /> {it.date}
                  <Clock size={14} /> {it.time}
                </p>

                <p className="text-sm text-gray-700 mt-1 font-medium flex items-center gap-2">
                  <Wallet2 size={14} /> {it.amount}
                </p>

                {it.checkin && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <Footprints size={13} className="text-gray-600" /> Checkin: {it.checkin} — Checkout: {it.checkout}
                  </p>
                )}
              </div>

              <button className="p-2 rounded-md bg-gray-100 hover:bg-blue-100 transition">
                <Eye className="w-5 h-5 text-gray-700 hover:text-blue-700" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;