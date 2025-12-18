import { useState, useEffect } from "react";
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
  XCircle,
  Loader2,
} from "lucide-react";
import userService, { type DashboardStats } from "@/services/userService";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await userService.getDashboardStats();
        setStats(data);
      } catch (err: any) {
        console.error("Failed to fetch dashboard:", err);
        setError(err.response?.data?.message || "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "renting":
        return <Package className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50";
      case "cancelled":
        return "bg-red-50";
      case "renting":
        return "bg-blue-50";
      default:
        return "bg-gray-50";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      case "renting":
        return "Đang thuê";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <p>{error}</p>
      </div>
    );
  }

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
          title="Hoạt động gần đây"
          value={String(stats?.bookingsThisMonth || 0)}
          colorClass="text-blue-600"
          icon={<CalendarClock className="w-5 h-5 text-blue-600" />} 
        />
        <StatCard
          title="Thiết bị đang thuê"
          value={String(stats?.activeRentals || 0)}
          colorClass="text-purple-600"
          icon={<Package className="w-5 h-5 text-purple-600" />} 
        />
        <StatCard
          title="Chi tiêu tháng này"
          value={`${(stats?.spendingThisMonth || 0).toLocaleString("vi-VN")} ₫`}
          colorClass="text-green-600"
          icon={<Wallet className="w-5 h-5 text-green-600" />}
        />
        <StatCard
          title="Điểm vi phạm"
          value={String(stats?.penaltyPoints || 0)}
          colorClass="text-red-600"
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
        />
      </div>

      {/* Activity summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            Thiết bị đang thuê
          </h2>
          <div className="space-y-3 text-sm">
            {stats?.upcomingRentals && stats.upcomingRentals.length > 0 ? (
              stats.upcomingRentals.map((rental) => (
                <div key={rental.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {rental.equipment?.name || "Thiết bị"}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {new Date(rental.date).toLocaleDateString("vi-VN")} • {rental.duration}h
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">📦 Bạn chưa có thiết bị nào đang thuê.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            Hoạt động gần đây
          </h2>
          <div className="space-y-3 text-sm">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg ${getStatusBg(activity.status)}`}
                >
                  {getStatusIcon(activity.status)}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {activity.type === 'booking' 
                        ? (activity.facility?.name || "Sân") 
                        : (activity.equipment?.name || "Thiết bị")} 
                      {' '}- {getStatusText(activity.status)}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {formatDate(activity.date)} • {activity.totalPrice.toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">📋 Chưa có hoạt động nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
