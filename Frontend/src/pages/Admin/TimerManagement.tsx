import { Calendar, Clock, CheckCircle2, Lock, RefreshCw, Building2, Unlock } from "lucide-react";
import StatCard from "@/components/Admin/StatCard";
import PageHeader from "@/components/Admin/PageHeader";
import { useEffect, useMemo, useState, useCallback } from "react";
import bookingService from "@/services/bookingService";
import type { TimeSlot, TimeSlotStats, WeekSlotStats, MonthSlotStats } from "@/services/bookingService";

type SlotStatus = "Đã đặt" | "Trống" | "Đã khóa" | "Đang sử dụng";

interface TimeSlotItem {
  time: string;
  user: string;
  status: SlotStatus;
  sport: string;
  bookingId?: string;
}

// Map API status to display status
const mapStatus = (apiStatus: string): SlotStatus => {
  switch (apiStatus) {
    case 'booked':
      return 'Đã đặt';
    case 'locked':
      return 'Đã khóa';
    case 'available':
    default:
      return 'Trống';
  }
};

const TimerManagement = () => {
  // State
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedFacility, setSelectedFacility] = useState<string>("");
  const [view, setView] = useState<"day" | "week" | "month" | "year">("day");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [timeSlots, setTimeSlots] = useState<TimeSlotItem[]>([]);
  const [stats, setStats] = useState<TimeSlotStats>({ total: 0, booked: 0, available: 0, locked: 0 });
  const [weekData, setWeekData] = useState<WeekSlotStats[]>([]);
  const [monthData, setMonthData] = useState<MonthSlotStats[]>([]);
  const [facilities, setFacilities] = useState<{ id: string; name: string; location: string }[]>([]);

  // Load facilities từ API
  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const data = await bookingService.getUniqueFacilities();
        setFacilities(data);
        // Tự động chọn sân đầu tiên nếu có
        if (data.length > 0) {
          setSelectedFacility(data[0].id);
        }
      } catch (err) {
        console.error("Error loading facilities:", err);
      }
    };
    loadFacilities();
  }, []);

  // Load time slots for day
  const loadDayData = useCallback(async () => {
    if (!selectedFacility) return;
    
    setLoading(true);
    setError(null);
    try {
      const [slotsData, statsData] = await Promise.all([
        bookingService.getTimeSlotsForDay(selectedFacility, selectedDate),
        bookingService.getTimeSlotStats(selectedFacility, selectedDate),
      ]);
      
      // Transform API data to UI format
      const transformedSlots: TimeSlotItem[] = slotsData.map((slot: TimeSlot) => ({
        time: slot.timeSlot,
        user: slot.booking ? `${slot.booking.userId}` : "-",
        status: mapStatus(slot.status),
        sport: slot.booking?.facilityName || "-",
        bookingId: slot.booking?._id,
      }));

      setTimeSlots(transformedSlots);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || "Lỗi khi tải dữ liệu");
      console.error("Error loading day data:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedFacility, selectedDate]);

  // Load week data
  const loadWeekData = useCallback(async () => {
    if (!selectedFacility) return;
    
    setLoading(true);
    setError(null);
    try {
      // Get start of current week (Monday)
      const date = new Date(selectedDate);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      const startOfWeek = new Date(date.setDate(diff));
      const startDate = startOfWeek.toISOString().split('T')[0];

      console.log('📅 Loading week data:', { facilityId: selectedFacility, startDate });
      const data = await bookingService.getTimeSlotsForWeek(selectedFacility, startDate);
      console.log('📅 Week data received:', data);
      setWeekData(data);
    } catch (err: any) {
      console.error('❌ Error loading week data:', err);
      setError(err.message || "Lỗi khi tải dữ liệu tuần");
    } finally {
      setLoading(false);
    }
  }, [selectedFacility, selectedDate]);

  // Load month data
  const loadMonthData = useCallback(async () => {
    if (!selectedFacility) return;
    
    setLoading(true);
    setError(null);
    try {
      const date = new Date(selectedDate);
      console.log('📅 Loading month data:', { facilityId: selectedFacility, year: date.getFullYear(), month: date.getMonth() + 1 });
      const data = await bookingService.getTimeSlotsForMonth(
        selectedFacility,
        date.getFullYear(),
        date.getMonth() + 1
      );
      console.log('📅 Month data received:', data);
      setMonthData(data);
    } catch (err: any) {
      console.error('❌ Error loading month data:', err);
      setError(err.message || "Lỗi khi tải dữ liệu tháng");
    } finally {
      setLoading(false);
    }
  }, [selectedFacility, selectedDate]);

  // Effect to load data based on view
  useEffect(() => {
    if (!selectedFacility) {
      console.log('⚠️ No facility selected');
      return;
    }
    
    console.log(`📊 View changed to: ${view}`);
    
    if (view === "day") {
      console.log('📅 Loading day view data');
      loadDayData();
    } else if (view === "week") {
      console.log('📅 Loading week view data');
      loadWeekData();
    } else if (view === "month") {
      console.log('📅 Loading month view data');
      loadMonthData();
    }
  }, [view, selectedFacility, selectedDate]);

  // Handle lock/unlock slot
  const handleLockUnlock = async (slot: TimeSlotItem) => {
    if (!selectedFacility) return;

    try {
      if (slot.status === "Đã khóa") {
        // Unlock
        await bookingService.unlockTimeSlot(selectedFacility, selectedDate, slot.time);
      } else if (slot.status === "Trống") {
        // Lock
        const reason = prompt("Nhập lý do khóa khung giờ:");
        if (reason !== null) {
          await bookingService.lockTimeSlot(selectedFacility, selectedDate, slot.time, reason);
        }
      }
      // Reload data
      loadDayData();
    } catch (err: any) {
      alert(err.message || "Lỗi khi thực hiện thao tác");
    }
  };

  // Stats cards config
  const statsCards = [
    {
      id: 1,
      title: "Tổng khung giờ",
      value: `${stats.total}`,
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
      value: `${stats.booked}`,
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
      value: `${stats.available}`,
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
      value: `${stats.locked}`,
      note: "",
      color: "text-red-600",
      icon: (
        <div className="p-2 bg-red-50 rounded-lg">
          <Lock className="w-5 h-5 text-red-600" />
        </div>
      ),
    },
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
        return { label: "Khóa slot", className: "text-orange-600 border-orange-200 hover:bg-orange-50", icon: <Lock size={14} /> };
      }
      if (item.status === "Đã khóa") {
        return { label: "Mở khóa", className: "text-green-600 border-green-200 hover:bg-green-50", icon: <Unlock size={14} /> };
      }
      if (item.status === "Đang sử dụng") {
        return { label: "Đang dùng", className: "text-gray-700 border-gray-300 bg-white cursor-not-allowed", disabled: true };
      }
      return { label: "Đã đặt", className: "text-gray-700 border-gray-300 bg-white cursor-not-allowed", disabled: true };
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
            onClick={() => handleLockUnlock(item)}
            className={`flex items-center gap-1 text-xs rounded-md px-2 py-1 border ${actionCfg.className}`}
          >
            {actionCfg.icon} {actionCfg.label}
          </button>
        </div>
      </div>
    );
  }

  // Split time slots into two columns
  const halfLength = Math.ceil(timeSlots.length / 2);
  const leftColumn = timeSlots.slice(0, halfLength);
  const rightColumn = timeSlots.slice(halfLength);

  // Debug effect
  useEffect(() => {
    console.log(`🎯 State update - view: ${view}, loading: ${loading}, weekData: ${weekData.length}, monthData: ${monthData.length}`);
  }, [view, loading, weekData, monthData]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return `${days[date.getDay()]} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <div className="flex flex-col gap-8 pt-4">
      
      <PageHeader
        title="Quản lý khung giờ sân"
        subtitle="Theo dõi và quản lý lịch đặt sân"
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2">
          <Building2 size={18} className="text-blue-600" />
          <select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="border-2 border-blue-300 rounded-md px-3 py-2 text-sm bg-white font-medium text-gray-800 focus:border-blue-500 focus:outline-none"
          >
            <option value="">-- Chọn sân --</option>
            {facilities.map((f) => (
              <option key={f.id} value={f.id}>{f.name} - {f.location}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-blue-600" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-2 border-blue-300 rounded-md px-3 py-2 text-sm bg-white font-medium text-gray-800 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <button
          onClick={() => {
            if (view === "day") loadDayData();
            else if (view === "week") loadWeekData();
            else if (view === "month") loadMonthData();
          }}
          disabled={!selectedFacility || loading}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Tải lại
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats cards - only show when facility selected */}
      {selectedFacility && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsCards.map((item) => (
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
      )}

      {/* View toggle */}
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

      {/* Content based on view */}
      {!selectedFacility ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center text-gray-500">
          Vui lòng chọn sân để xem khung giờ
        </div>
      ) : loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center">
          <RefreshCw size={24} className="animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {view === "day" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-800">
                  <Calendar size={18} />
                  <p className="font-medium">{formatDate(selectedDate)}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {stats.booked}/{stats.total} khung giờ đã đặt
                </p>
              </div>

              {timeSlots.length === 0 ? (
                <p className="text-center text-gray-500 mt-6">Không có khung giờ nào</p>
              ) : (
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
              )}
            </div>
          )}

          {view === "week" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-gray-800 mb-4">
                <Calendar size={18} />
                <h3 className="text-lg font-semibold">Tuần này</h3>
              </div>
              {loading && weekData.length === 0 ? (
                <div className="text-center py-8">
                  <RefreshCw size={24} className="animate-spin mx-auto text-blue-600" />
                  <p className="mt-2 text-gray-500">Đang tải dữ liệu tuần...</p>
                </div>
              ) : weekData.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Không có dữ liệu cho tuần này</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                  {weekData.map((day) => (
                    <div 
                      key={day.date} 
                      className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        setSelectedDate(day.date);
                        setView("day");
                      }}
                    >
                      <p className="text-sm font-medium text-blue-700">{day.dayOfWeek}</p>
                      <p className="text-xs text-gray-500">{day.date.split('-')[2]}/{day.date.split('-')[1]}</p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">
                        {day.booked}<span className="text-sm font-normal text-gray-400">/{day.total}</span>
                      </p>
                      <p className="text-xs text-gray-500">đã đặt</p>
                      {day.locked > 0 && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <Lock size={10} /> {day.locked} khóa
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === "month" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-gray-800 mb-4">
                <Calendar size={18} />
                <h3 className="text-lg font-semibold">
                  Tháng {new Date(selectedDate).getMonth() + 1}/{new Date(selectedDate).getFullYear()}
                </h3>
              </div>
              {loading && monthData.length === 0 ? (
                <div className="text-center py-8">
                  <RefreshCw size={24} className="animate-spin mx-auto text-blue-600" />
                  <p className="mt-2 text-gray-500">Đang tải dữ liệu tháng...</p>
                </div>
              ) : monthData.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Không có dữ liệu cho tháng này</p>
              ) : (
                <>
                  {/* Header ngày trong tuần */}
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((d) => (
                      <div key={d} className="text-center text-xs font-semibold text-gray-500 py-1">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {monthData.map((d) => {
                      const hasBookings = d.booked > 0;
                      const isLocked = d.locked > 0;
                      return (
                        <div
                          key={d.date}
                          className={`h-20 border rounded-md p-2 flex flex-col cursor-pointer transition-all hover:shadow-md ${
                            hasBookings ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                          } ${isLocked ? 'ring-2 ring-red-300' : ''}`}
                          onClick={() => {
                            setSelectedDate(d.date);
                            setView("day");
                          }}
                        >
                          <span className="text-sm font-medium text-gray-700">{d.day}</span>
                          <span className={`mt-auto text-sm font-semibold ${hasBookings ? 'text-blue-600' : 'text-gray-400'}`}>
                            {d.booked}/{d.total}
                          </span>
                          {d.locked > 0 && (
                            <span className="text-xs text-red-500 flex items-center gap-0.5">
                              <Lock size={8} />{d.locked}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {view === "year" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-gray-800 mb-4">
                <Calendar size={18} />
                <h3 className="text-lg font-semibold">Năm {new Date(selectedDate).getFullYear()}</h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                  const currentMonth = new Date().getMonth() + 1;
                  const currentYear = new Date().getFullYear();
                  const selectedYear = new Date(selectedDate).getFullYear();
                  const isCurrentMonth = m === currentMonth && selectedYear === currentYear;
                  const isPastMonth = selectedYear < currentYear || (selectedYear === currentYear && m < currentMonth);
                  
                  return (
                    <div
                      key={m}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        isCurrentMonth 
                          ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-300' 
                          : isPastMonth 
                            ? 'bg-gray-100 border-gray-200' 
                            : 'bg-green-50 border-green-200'
                      }`}
                      onClick={() => {
                        const year = new Date(selectedDate).getFullYear();
                        setSelectedDate(`${year}-${String(m).padStart(2, '0')}-01`);
                        setView("month");
                      }}
                    >
                      <p className={`text-lg font-bold ${isCurrentMonth ? 'text-blue-700' : 'text-gray-700'}`}>T{m}</p>
                      <p className="text-xs text-gray-500 mt-1">Click để xem chi tiết</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TimerManagement;