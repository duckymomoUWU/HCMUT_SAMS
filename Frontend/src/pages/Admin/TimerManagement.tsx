import { Calendar, ChevronDown, Clock, CheckCircle2, Lock } from "lucide-react";
import StatCard from "@/components/Admin/StatCard";
import PageHeader from "@/components/Admin/PageHeader";
import { useMemo, useState } from "react";

type SlotStatus = "Đã đặt" | "Trống" | "Đã khóa" | "Đang sử dụng";

interface TimeSlotItem {
  time: string;
  user: string;
  status: SlotStatus;
  sport: string;
}

const TimerManagement = () => {
  const totalSlots = 12;
  const booked = 10;
  const available = 1;
  const locked = 1;

  const stats = [
    {
      id: 1,
      title: "Tổng khung giờ",
      value: `${totalSlots}`,
      note: "",
      color: "text-blue-600",
      icon: (
        <div className="p-2 bg-blue-50 rounded-lg">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
      ),
    },
    {
      id: 2,
      title: "Đã đặt",
      value: `${booked}`,
      note: "",
      color: "text-indigo-600",
      icon: (
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Clock className="w-5 h-5 text-indigo-600" />
        </div>
      ),
    },
    {
      id: 3,
      title: "Còn trống",
      value: `${available}`,
      note: "",
      color: "text-green-600",
      icon: (
        <div className="p-2 bg-green-50 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        </div>
      ),
    },
    {
      id: 4,
      title: "Bị khóa",
      value: `${locked}`,
      note: "",
      color: "text-red-600",
      icon: (
        <div className="p-2 bg-red-50 rounded-lg">
          <Lock className="w-5 h-5 text-red-600" />
        </div>
      ),
    },
  ];

  const [view, setView] = useState<"day" | "week" | "month" | "year">("day");

  const leftColumn: TimeSlotItem[] = [
    { time: "7:00 - 8:00", user: "Nguyễn Văn A (student1@hcmut.edu.vn)", status: "Đã đặt", sport: "Bóng đá" },
    { time: "8:00 - 9:00", user: "Nguyễn Văn A (student1@hcmut.edu.vn)", status: "Trống", sport: "Bóng đá" },
    { time: "9:00 - 10:00", user: "Nguyễn Văn A (student1@hcmut.edu.vn)", status: "Đã khóa", sport: "Bóng đá" },
    { time: "10:00 - 11:00", user: "Nguyễn Văn A (student1@hcmut.edu.vn)", status: "Đã đặt", sport: "Bóng đá" },
    { time: "13:00 - 14:00", user: "Nguyễn Văn A (student1@hcmut.edu.vn)", status: "Đã đặt", sport: "Bóng đá" },
    { time: "14:00 - 15:00", user: "Nguyễn Văn A (student1@hcmut.edu.vn)", status: "Đã đặt", sport: "Bóng đá" },
  ];

  const rightColumn: TimeSlotItem[] = [
    { time: "15:00 - 16:00", user: "Nguyễn Văn A (student1@hcmut.edu.vn)", status: "Đã đặt", sport: "Bóng đá" },
    { time: "16:00 - 17:00", user: "Nguyễn Văn A (student1@hcmut.edu.vn)", status: "Đã đặt", sport: "Bóng đá" },
    { time: "17:00 - 18:00", user: "Nguyễn Văn A (student1@hcmut.edu.vn)", status: "Đã đặt", sport: "Bóng đá" },
    { time: "18:00 - 19:00", user: "Nguyễn Văn A (student1@hcmut.edu.vn)", status: "Đã đặt", sport: "Bóng đá" },
    { time: "19:00 - 20:00", user: "Nguyễn Văn A (student1@hcmut.edu.vn)", status: "Đã đặt", sport: "Bóng đá" },
    { time: "20:00 - 21:00", user: "Nguyễn Văn A (student1@hcmut.edu.vn)", status: "Đã đặt", sport: "Bóng đá" },
  ];

  const statusClass: Record<SlotStatus, string> = {
    "Đã đặt": "bg-blue-100 text-blue-700",
    "Trống": "bg-green-100 text-green-700",
    "Đã khóa": "bg-gray-200 text-gray-700",
    "Đang sử dụng": "bg-blue-100 text-blue-700",
  };

  function SlotCard({ item }: { item: TimeSlotItem }) {
    const actionCfg = useMemo(() => {
      if (item.status === "Trống") {
        return { label: "Đặt ngay", className: "text-blue-600 border-blue-200 hover:bg-blue-50" };
      }
      if (item.status === "Đã khóa") {
        return { label: "Bị khóa", className: "text-gray-500 border-gray-300 bg-gray-100 cursor-not-allowed", disabled: true };
      }
      if (item.status === "Đang sử dụng") {
        return { label: "Đang dùng", className: "text-gray-700 border-gray-300 bg-white" };
      }
      return { label: "Đã đặt", className: "text-gray-700 border-gray-300 bg-white" };
    }, [item.status]);

    return (
      <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-gray-600">
            <Clock size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-800">{item.time}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">00:45</span>
            </div>
            <p className="text-sm text-gray-700">{item.user}</p>
            <p className="text-xs text-gray-500">{item.sport}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusClass[item.status]}`}>
            {item.status}
          </span>
          <button
            disabled={Boolean((actionCfg as any).disabled)}
            className={`flex items-center gap-1 text-xs rounded-md px-2 py-1 border ${actionCfg.className}`}
          >
            {actionCfg.label} <ChevronDown size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pt-4">
      
      <PageHeader
        title="Quản lý khung giờ sân"
        subtitle="Theo dõi và quản lý lịch đặt sân"
      />
      {/* Thẻ thống kê   */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
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

      {/* Bộ lọc khung nhìn */}
      <div className="flex flex-wrap items-center gap-3">
        {["day", "week", "month", "year"].map((mode) => (
          <button
            key={mode}
            onClick={() => setView(mode as any)}
            className={`px-3 py-1.5 text-sm border rounded-md ${
              view === mode
                ? "bg-gray-100 text-gray-900 border-gray-300"
                : "text-gray-800 bg-white border-gray-300 hover:bg-gray-50"
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

      {/* Nội dung hiển thị theo chế độ */}
      {view === "day" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-800">
              <Calendar size={18} />
              <p className="font-medium">Thứ 2 - 30/9/2024</p>
            </div>
            <p className="text-sm text-gray-500">
              {booked}/{totalSlots} khung giờ đã đặt
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
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
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-gray-800 mb-4">
            <Calendar size={18} />
            <h3 className="text-lg font-semibold">Tuần này</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
              <div key={d} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">{d}</p>
                <p className="text-xl font-semibold text-blue-600 mt-1">
                  {Math.floor(Math.random() * totalSlots)}/{totalSlots}
                </p>
                <p className="text-xs text-gray-500 mt-1">khung giờ đã đặt</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "month" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-gray-800 mb-4">
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
                    className="h-20 border border-gray-200 rounded-md p-2 bg-gray-50 flex flex-col"
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
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 text-gray-800 mb-4">
            <Calendar size={18} />
            <h3 className="text-lg font-semibold">Năm 2024</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((m) => (
              <div key={m} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">Tháng {m}</p>
                <p className="text-xl font-semibold text-green-600 mt-1">
                  {Math.floor(Math.random() * 200)}
                </p>
                <p className="text-xs text-gray-500 mt-1">tổng lượt đặt</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerManagement;