import { useState } from "react";
import Sidebar from "../../components/Admin/SideBar";
import Header from "../../components/Admin/Header";
import StatsCard from "../../components/Admin/StatsCard";
import { useMemo } from "react";
import { Calendar, ChevronDown, Clock, CheckCircle2, Lock } from "lucide-react";

type SlotStatus = "Đã đặt" | "Trống" | "Đã khóa" | "Đang sử dụng";

interface TimeSlotItem {
  time: string;
  user: string;
  status: SlotStatus;
  sport: string;
}

type ActionConfig = {
  label: string;
  className: string;
  disabled?: boolean;
};

const TimerManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const totalSlots = 12;
  const booked = 10;
  const available = 1;
  const locked = 1;

  const stats = [
    {
      title: "Tổng khung giờ",
      value: `${totalSlots}`,
      change: "",
      changeType: "positive" as const,
      icon: <Calendar className="h-8 w-8 text-[#007be5] md:h-10 md:w-10" />,
    },
    {
      title: "Đã đặt",
      value: `${booked}`,
      change: "",
      changeType: "positive" as const,
      icon: <Clock className="h-8 w-8 text-[#007be5] md:h-10 md:w-10" />,
    },
    {
      title: "Còn trống",
      value: `${available}`,
      change: "",
      changeType: "positive" as const,
      icon: <CheckCircle2 className="h-8 w-8 text-[#007be5] md:h-10 md:w-10" />,
    },
    {
      title: "Bị khóa",
      value: `${locked}`,
      change: "",
      changeType: "positive" as const,
      icon: <Lock className="h-8 w-8 text-[#007be5] md:h-10 md:w-10" />,
    },
  ];

  const [view, setView] = useState<"day" | "week" | "month" | "year">("day");

  const modes: ("day" | "week" | "month" | "year")[] = [
    "day",
    "week",
    "month",
    "year",
  ];

  const leftColumn: TimeSlotItem[] = [
    {
      time: "7:00 - 8:00",
      user: "Nguyễn Văn A (student1@hcmut.edu.vn)",
      status: "Đã đặt",
      sport: "Bóng đá",
    },
    {
      time: "8:00 - 9:00",
      user: "Nguyễn Văn A (student1@hcmut.edu.vn)",
      status: "Trống",
      sport: "Bóng đá",
    },
    {
      time: "9:00 - 10:00",
      user: "Nguyễn Văn A (student1@hcmut.edu.vn)",
      status: "Đã khóa",
      sport: "Bóng đá",
    },
    {
      time: "10:00 - 11:00",
      user: "Nguyễn Văn A (student1@hcmut.edu.vn)",
      status: "Đã đặt",
      sport: "Bóng đá",
    },
    {
      time: "13:00 - 14:00",
      user: "Nguyễn Văn A (student1@hcmut.edu.vn)",
      status: "Đã đặt",
      sport: "Bóng đá",
    },
    {
      time: "14:00 - 15:00",
      user: "Nguyễn Văn A (student1@hcmut.edu.vn)",
      status: "Đã đặt",
      sport: "Bóng đá",
    },
  ];

  const rightColumn: TimeSlotItem[] = [
    {
      time: "15:00 - 16:00",
      user: "Nguyễn Văn A (student1@hcmut.edu.vn)",
      status: "Đã đặt",
      sport: "Bóng đá",
    },
    {
      time: "16:00 - 17:00",
      user: "Nguyễn Văn A (student1@hcmut.edu.vn)",
      status: "Đã đặt",
      sport: "Bóng đá",
    },
    {
      time: "17:00 - 18:00",
      user: "Nguyễn Văn A (student1@hcmut.edu.vn)",
      status: "Đã đặt",
      sport: "Bóng đá",
    },
    {
      time: "18:00 - 19:00",
      user: "Nguyễn Văn A (student1@hcmut.edu.vn)",
      status: "Đã đặt",
      sport: "Bóng đá",
    },
    {
      time: "19:00 - 20:00",
      user: "Nguyễn Văn A (student1@hcmut.edu.vn)",
      status: "Đã đặt",
      sport: "Bóng đá",
    },
    {
      time: "20:00 - 21:00",
      user: "Nguyễn Văn A (student1@hcmut.edu.vn)",
      status: "Đã đặt",
      sport: "Bóng đá",
    },
  ];

  const statusClass: Record<SlotStatus, string> = {
    "Đã đặt": "bg-blue-100 text-blue-700",
    Trống: "bg-green-100 text-green-700",
    "Đã khóa": "bg-gray-200 text-gray-700",
    "Đang sử dụng": "bg-blue-100 text-blue-700",
  };

  function SlotCard({ item }: { item: TimeSlotItem }) {
    const actionCfg: ActionConfig = useMemo(() => {
      if (item.status === "Trống") {
        return {
          label: "Đặt ngay",
          className: "text-blue-600 border-blue-200 hover:bg-blue-50",
        };
      }
      if (item.status === "Đã khóa") {
        return {
          label: "Bị khóa",
          className:
            "text-gray-500 border-gray-300 bg-gray-100 cursor-not-allowed",
          disabled: true,
        };
      }
      if (item.status === "Đang sử dụng") {
        return {
          label: "Đang dùng",
          className: "text-gray-700 border-gray-300 bg-white",
        };
      }
      return {
        label: "Đã đặt",
        className: "text-gray-700 border-gray-300 bg-white",
      };
    }, [item.status]);

    return (
      <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-gray-600">
            <Clock size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800">{item.time}</p>
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] text-blue-700">
                00:45
              </span>
            </div>
            <p className="text-sm text-gray-700">{item.user}</p>
            <p className="text-xs text-gray-500">{item.sport}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass[item.status]}`}
          >
            {item.status}
          </span>
          <button
            disabled={!!actionCfg.disabled}
            className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${actionCfg.className}`}
          >
            {actionCfg.label} <ChevronDown size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#b7e63e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 transition-all lg:ml-68">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-6 h-16 rounded-lg bg-[#006199] p-4">
            <h1 className="mb-2 text-2xl leading-tight font-normal md:text-[28px] md:leading-[13px]">
              Quản lý khung giờ
            </h1>
            <p className="text-xs text-white">
              Theo dõi và quản lý lịch đặt sân
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 border-[gray] sm:grid-cols-2 md:mb-8 md:gap-6 lg:grid-cols-4">
            {stats.map((item, index) => (
              <StatsCard
                key={index}
                title={item.title}
                value={item.value}
                change={item.change}
                changeType={item.changeType}
                icon={item.icon}
              />
            ))}
          </div>

          {/* Bộ lọc khung nhìn */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3">
              {modes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setView(mode)}
                  className={`rounded-md border px-3 py-1.5 text-sm ${
                    view === mode
                      ? "bg-[gray] text-white"
                      : "bg-white text-gray-800 hover:bg-[#d9d9d9]"
                  }`}
                >
                  {mode === "day"
                    ? "Lịch ngày"
                    : mode === "week"
                      ? "Lịch tuần"
                      : mode === "month"
                        ? "Lịch tháng"
                        : "Lịch năm"}
                </button>
              ))}
            </div>
          </div>

          {/* Nội dung hiển thị theo chế độ */}
          {view === "day" && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-800">
                  <Calendar size={18} />
                  <p className="font-medium">Thứ 2 - 30/9/2024</p>
                </div>
                <p className="text-sm text-gray-500">
                  {booked}/{totalSlots} khung giờ đã đặt
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-3">
                  {leftColumn.map((item) => (
                    <SlotCard key={item.time} item={item} />
                  ))}
                </div>
                <div className="space-y-3">
                  {rightColumn.map((item) => (
                    <SlotCard key={item.time} item={item} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === "week" && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-gray-800">
                <Calendar size={18} />
                <h3 className="text-lg font-semibold">Tuần này</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                  <div
                    key={d}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <p className="text-sm text-gray-500">{d}</p>
                    <p className="mt-1 text-xl font-semibold text-blue-600">
                      {Math.floor(Math.random() * totalSlots)}/{totalSlots}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      khung giờ đã đặt
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === "month" && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-gray-800">
                <Calendar size={18} />
                <h3 className="text-lg font-semibold">Tháng 9/2024</h3>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array(30)
                  .fill(0)
                  .map((_, idx) => {
                    const day = idx + 1;
                    return (
                      <div
                        key={day}
                        className="flex h-20 flex-col rounded-md border border-gray-200 bg-gray-50 p-2"
                      >
                        <span className="text-xs text-gray-500">{day}</span>
                        <span className="mt-auto text-xs text-blue-600">
                          {Math.floor(Math.random() * totalSlots)}/{totalSlots}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {view === "year" && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-gray-800">
                <Calendar size={18} />
                <h3 className="text-lg font-semibold">Năm 2024</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                ].map((m) => (
                  <div
                    key={m}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <p className="text-sm text-gray-500">Tháng {m}</p>
                    <p className="mt-1 text-xl font-semibold text-green-600">
                      {Math.floor(Math.random() * 200)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">tổng lượt đặt</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TimerManagement;
