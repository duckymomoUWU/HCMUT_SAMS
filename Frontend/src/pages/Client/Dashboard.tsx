import PageHeader from "@/components/Admin/PageHeader";
import StatCard from "@/components/Admin/StatCard";
import {
  CalendarClock,
  Package,
  Wallet,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-8 pt-4">
      {/* Header */}
      <PageHeader
        title="Tổng quan"
        subtitle="Theo dõi các hoạt động đặt sân và thuê thiết bị của bạn"
      />

      {/* Stats overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Booking tháng này"
          value="0"
          colorClass="text-blue-600"
          icon={<CalendarClock className="h-5 w-5 text-blue-600" />}
        />
        <StatCard
          title="Thiết bị đang thuê"
          value="0"
          colorClass="text-purple-600"
          icon={<Package className="h-5 w-5 text-purple-600" />}
        />
        <StatCard
          title="Chi tiêu tháng này"
          value="0 ₫"
          colorClass="text-green-600"
          icon={<Wallet className="h-5 w-5 text-green-600" />}
        />
        <StatCard
          title="Điểm vi phạm"
          value="2"
          colorClass="text-red-600"
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
        />
      </div>

      {/* Activity summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Clock className="h-4 w-4 text-blue-500" />
            Lịch đặt sắp tới
          </h2>
          <div className="space-y-3 text-sm">
            <p className="text-gray-600">
              🎾 Bạn chưa có lịch đặt sân nào sắp tới.
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Hoạt động gần đây
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">
                  Hoàn thành đặt sân Tennis - A1
                </p>
                <p className="text-xs text-gray-600">3 ngày trước</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
              <Package className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">
                  Trả thiết bị vợt cầu lông
                </p>
                <p className="text-xs text-gray-600">1 tuần trước</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-yellow-50 p-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Bị trễ giờ trả sân</p>
                <p className="text-xs text-gray-600">2 tuần trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
