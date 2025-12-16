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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Booking tháng này"
          value="0"
          colorClass="text-blue-600"
          icon={<CalendarClock className="w-5 h-5 text-blue-600" />} 
        />
        <StatCard
          title="Thiết bị đang thuê"
          value="0"
          colorClass="text-purple-600"
          icon={<Package className="w-5 h-5 text-purple-600" />} 
        />
        <StatCard
          title="Chi tiêu tháng này"
          value="0 ₫"
          colorClass="text-green-600"
          icon={<Wallet className="w-5 h-5 text-green-600" />}
        />
        <StatCard
          title="Điểm vi phạm"
          value="2"
          colorClass="text-red-600"
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
        />
      </div>

      {/* Activity summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            Lịch đặt sắp tới
          </h2>
          <div className="space-y-3 text-sm">
            <p className="text-gray-600">🎾 Bạn chưa có lịch đặt sân nào sắp tới.</p> 
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Hoạt động gần đây
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Hoàn thành đặt sân Tennis - A1</p>
                <p className="text-gray-600 text-xs">3 ngày trước</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Package className="h-5 w-5 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Trả thiết bị vợt cầu lông</p>
                <p className="text-gray-600 text-xs">1 tuần trước</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">Bị trễ giờ trả sân</p>
                <p className="text-gray-600 text-xs">2 tuần trước</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
