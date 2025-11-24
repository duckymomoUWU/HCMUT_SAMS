import StatCard from "@/components/Admin/StatCard";
import PageHeader from "@/components/Admin/PageHeader";
import {
  Calendar,
  Package,
  DollarSign,
  Activity,
  BarChart3,
  Dumbbell,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const stats = [
    {
      id: 1,
      title: "Khung giờ đã đặt hôm nay",
      value: "8/12",
      note: "+2 từ hôm qua",
      color: "text-blue-600",
      icon: (
        <div className="rounded-lg bg-blue-50 p-2">
          <Calendar className="h-5 w-5 text-blue-600" />
        </div>
      ),
    },
    {
      id: 2,
      title: "Thiết bị đang sử dụng",
      value: "15/80",
      note: "3 thiết bị đang bảo trì",
      color: "text-green-600",
      icon: (
        <div className="rounded-lg bg-green-50 p-2">
          <Package className="h-5 w-5 text-green-600" />
        </div>
      ),
    },
    {
      id: 3,
      title: "Doanh thu hôm nay",
      value: "1.1Tr VND",
      note: "+15%",
      color: "text-yellow-600",
      icon: (
        <div className="rounded-lg bg-yellow-50 p-2">
          <DollarSign className="h-5 w-5 text-yellow-600" />
        </div>
      ),
    },
    {
      id: 4,
      title: "Tỉ lệ sử dụng sân",
      value: "67%",
      note: "8/12 khung giờ sân",
      color: "text-purple-600",
      icon: (
        <div className="rounded-lg bg-purple-50 p-2">
          <Activity className="h-5 w-5 text-purple-600" />
        </div>
      ),
    },
  ];

  const chartData = [
    { day: "T2", bookings: 6 },
    { day: "T3", bookings: 7 },
    { day: "T4", bookings: 5 },
    { day: "T5", bookings: 9 },
    { day: "T6", bookings: 5 },
    { day: "T7", bookings: 4 },
    { day: "CN", bookings: 3 },
  ];

  const deviceStatus = [
    { name: "Bóng futsal", used: 8, total: 10 },
    { name: "Áo bib", used: 15, total: 20 },
    { name: "Vợt cầu lông", used: 6, total: 8 },
    { name: "Cọc biên", used: 8, total: 16 },
    { name: "Bóng rổ", used: 3, total: 5 },
  ];

  const bookings = [
    {
      time: "06:00 - 08:00",
      name: "Nguyễn Văn A",
      date: "04/10/2025",
      status: "Đã xác nhận",
      color: "bg-green-100 text-green-700",
      price: "200,000 VND",
    },
    {
      time: "06:00 - 08:00",
      name: "Nguyễn Văn A",
      date: "04/10/2025",
      status: "Chờ xử lí",
      color: "bg-yellow-100 text-yellow-700",
      price: "200,000 VND",
    },
    {
      time: "06:00 - 08:00",
      name: "Nguyễn Văn A",
      date: "04/10/2025",
      status: "Đã hủy",
      color: "bg-red-100 text-red-700",
      price: "200,000 VND",
    },
  ];

  const schedules = [
    {
      time: "06:00 - 08:00",
      name: "Nguyễn Văn A - Bóng đá",
      status: "Đang sử dụng",
      color: "bg-blue-100 text-blue-700",
    },
    {
      time: "08:00 - 10:00",
      name: "Nguyễn Văn A - Bóng đá",
      status: "Trống",
      color: "bg-green-100 text-green-700",
    },
    {
      time: "10:00 - 12:00",
      name: "Nguyễn Văn A - Bóng đá",
      status: "Chờ xác nhận",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      time: "14:00 - 16:00",
      name: "Nguyễn Văn A - Bóng đá",
      status: "Bảo trì",
      color: "bg-red-100 text-red-700",
    },
  ];

  return (
    <div className="flex flex-col gap-8 pt-4">
      <PageHeader
        title="Tổng quan"
        subtitle="Theo dõi tình hình thiết bị và sân trong ngày"
      />
      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard
            key={item.id}
            title={item.title}
            value={item.value}
            note={item.note}
            colorClass={item.color}
            icon={item.icon}
          />
        ))}
      </div>

      {/* Biểu đồ + tình trạng thiết bị */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Biểu đồ */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Slot sân trong tuần
            </h2>
            <span className="text-sm text-gray-500">
              Số booking theo từng ngày
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tình trạng thiết bị */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Tình trạng thiết bị
            </h2>
          </div>
          <div className="space-y-4">
            {deviceStatus.map((d) => {
              const percent = (d.used / d.total) * 100;
              return (
                <div key={d.name}>
                  <div className="mb-1 flex justify-between text-sm text-gray-600">
                    <span>{d.name}</span>
                    <span>
                      {d.used}/{d.total}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Danh sách đặt + Lịch khung giờ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Đặt lịch gần đây */}
        <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-800">
              Đặt lịch gần đây
            </h2>
          </div>

          <div className="space-y-3">
            {bookings.map((b, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-gray-100 p-4"
              >
                <div>
                  <p className="font-medium text-gray-700">{b.time}</p>
                  <p className="text-sm text-gray-700">{b.name}</p>
                  <p className="text-sm text-gray-500">{b.date}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${b.color}`}
                  >
                    {b.status}
                  </span>
                  <p className="mt-2 text-sm font-semibold text-gray-700">
                    {b.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 cursor-pointer rounded-md border border-gray-300 py-2 text-center text-sm font-medium text-gray-800 transition hover:bg-gray-50">
            Xem tất cả lịch đặt
          </div>
        </div>

        {/* Lịch hôm nay */}
        <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-800">
              Lịch khung giờ hôm nay
            </h2>
          </div>

          <div className="space-y-3">
            {schedules.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-gray-100 p-4"
              >
                <div>
                  <p className="font-medium text-gray-700">{s.time}</p>
                  <p className="text-sm text-gray-700">{s.name}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${s.color}`}
                >
                  {s.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 cursor-pointer rounded-md border border-gray-300 py-2 text-center text-sm font-medium text-gray-800 transition hover:bg-gray-50">
            Xem tất cả
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
