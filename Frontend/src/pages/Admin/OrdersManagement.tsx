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
        <div className="rounded-lg bg-blue-50 p-2">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
      ),
    },
    {
      id: 2,
      title: "Đã xác nhận",
      value: "1",
      color: "text-green-600",
      icon: (
        <div className="rounded-lg bg-green-50 p-2">
          <Package className="h-5 w-5 text-green-600" />
        </div>
      ),
    },
    {
      id: 3,
      title: "Chờ thanh toán",
      value: "1",
      color: "text-yellow-600",
      icon: (
        <div className="rounded-lg bg-yellow-50 p-2">
          <Wallet2 className="h-5 w-5 text-yellow-600" />
        </div>
      ),
    },
    {
      id: 4,
      title: "Doanh thu",
      value: "180.000đ",
      color: "text-indigo-600",
      icon: (
        <div className="rounded-lg bg-indigo-50 p-2">
          <Wallet2 className="h-5 w-5 text-indigo-600" />
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

  const filtered = bookings.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-8 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader
          title="Quản lý đơn đặt"
          subtitle="Theo dõi và quản lý tất cả các đơn đặt trong hệ thống"
        />
        <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700">
          <FileText className="h-4 w-4" /> Xuất báo cáo
        </button>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
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
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-800">
          <Search className="h-4 w-4 text-gray-600" /> Bộ lọc tìm kiếm
        </h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Tìm kiếm</label>
            <input
              type="text"
              placeholder="Mã booking, tên người dùng, sân..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-60 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-48 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
            >
              <option>Tất cả</option>
              <option>Đã xác nhận</option>
              <option>Chờ thanh toán</option>
              <option>Hoàn thành</option>
              <option>Không đến</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Ngày</label>
            <input
              type="date"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="ml-auto flex gap-2">
            <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-700">
              <Search size={14} /> Tìm kiếm
            </button>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("Tất cả");
              }}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Xóa bộ lọc
            </button>
          </div>
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
                    <Footprints size={13} className="text-gray-600" /> Checkin:{" "}
                    {it.checkin} — Checkout: {it.checkout}
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
    </div>
  );
};

export default OrdersManagement;
