import { useState } from "react";
import Sidebar from "../../components/Admin/SideBar";
import Header from "../../components/Admin/Header";
import StatsCard from "../../components/Admin/StatsCard";
import WeeklyChart from "../../components/Admin/WeeklyChart";
import EquipmentStatus from "../../components/Admin/EquipmentStatus";
import RecentBookings from "../../components/Admin/RecentBookings";
import TodaySchedule from "../../components/Admin/TodaySchedule";
import { Clock, Package, DollarSign, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#b7e63e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 transition-all lg:ml-68">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-6 h-16 rounded-lg bg-[#006199] p-4">
            <h1 className="mb-2 text-2xl leading-tight font-normal md:text-[28px] md:leading-[13px]">
              Tổng quan
            </h1>
            <p className="text-xs text-white">
              Theo dõi tình hình thiết bị trong ngày
            </p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mb-8 md:gap-6 lg:grid-cols-4">
            <StatsCard
              title="Khung giờ đã đặt hôm nay"
              value="8/12"
              change="+2 từ hôm qua"
              changeType="positive"
              icon={
                <Clock className="h-8 w-8 text-[#007be5] md:h-10 md:w-10" />
              }
            />

            <StatsCard
              title="Thiết bị đang sử dụng"
              value="15/80"
              change="3 thiết bị đang bảo trì"
              changeType="positive"
              icon={
                <Package className="h-8 w-8 text-[green] md:h-10 md:w-10" />
              }
            />

            <StatsCard
              title="Doanh thu hôm nay"
              value="1.1Tr VND"
              change="+ 15%"
              changeType="positive"
              icon={
                <DollarSign className="h-8 w-8 text-[yellow] md:h-10 md:w-10" />
              }
            />

            <StatsCard
              title="Tỷ lệ sử dụng sân"
              value="67%"
              change="8/12 khung giờ sân"
              changeType="positive"
              icon={
                <TrendingUp className="h-8 w-8 text-[purple] md:h-10 md:w-10" />
              }
            />
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:gap-6 lg:grid-cols-2">
            <WeeklyChart />
            <EquipmentStatus />
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
            <RecentBookings />
            <TodaySchedule />
          </div>
        </main>
      </div>
    </div>
  );
};
export default Dashboard;
