import { useState, useEffect } from "react";
import { CalendarDays, Clock, CheckCircle2, Loader2 } from "lucide-react";
import PageHeader from "@/components/Admin/PageHeader";
import StatCard from "@/components/Admin/StatCard";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "@/pages/Client/calendar.css";
import api from "@/lib/Axios";
import bookingService from "@/services/bookingService";

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<{ time: string; status: 'booked' | 'locked' }[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
  });

  // Facility info (có thể mở rộng để chọn nhiều sân)
  const facilityId = "facility-default";
  const facilityName = "Sân thể thao đa năng";
  const facilityLocation = "Khu A - ĐHBK";
  const pricePerHour = 180000;

  // Generate slots từ 7h đến 21h
  const generateSlots = () => {
    const baseSlots = [];
    const now = new Date();
    
    // So sánh ngày (không tính giờ)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const selectedDayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()).getTime();
    
    const isToday = selectedDayStart === todayStart;
    const isPastDay = selectedDayStart < todayStart;
    
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    for (let hour = 7; hour <= 20; hour++) {
      const timeStr = `${String(hour).padStart(2, "0")}:00 - ${String(hour + 1).padStart(2, "0")}:00`;
      
      // Check if slot is in the past
      let isPast = false;
      
      // Nếu ngày đã qua → tất cả slot đều past
      if (isPastDay) {
        isPast = true;
      }
      // Nếu là hôm nay → check giờ
      else if (isToday) {
        // Slot đã qua nếu giờ hiện tại >= giờ bắt đầu slot
        isPast = currentHour > hour || (currentHour === hour && currentMinute > 0);
      }
      // Nếu ngày tương lai → không past

      let status = "available";
      if (isPast) {
        status = "past";
      } else {
        // Kiểm tra xem slot có trong danh sách booked/locked không
        const slotInfo = bookedSlots.find(s => s.time === timeStr);
        if (slotInfo) {
          status = slotInfo.status; // 'booked' hoặc 'locked'
        }
      }

      baseSlots.push({
        time: timeStr,
        price: pricePerHour,
        status,
      });
    }
    return baseSlots;
  };

  const slots = generateSlots();

  // Fetch stats khi component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const bookings = await bookingService.getMyBookings();
        setStats({
          total: bookings.length,
          confirmed: bookings.filter((b) => b.status === "confirmed").length,
          pending: bookings.filter((b) => b.status === "pending").length,
          cancelled: bookings.filter((b) => b.status === "cancelled").length,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, []);

  // Fetch booked slots khi đổi ngày
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        setLoading(true);
        // Format date theo local timezone (YYYY-MM-DD)
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;
        
        const booked = await bookingService.getBookedSlots(facilityId, dateStr);
        setBookedSlots(booked);
        setSelectedSlot(null); // Reset selection khi đổi ngày
      } catch (error) {
        console.error("Failed to fetch booked slots:", error);
        setBookedSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookedSlots();
  }, [selectedDate]);

  const handleBookingSubmit = async () => {
    if (selectedSlot === null) {
      alert("Vui lòng chọn khung giờ");
      return;
    }

    setIsProcessing(true);

    try {
      // Format date theo local timezone (YYYY-MM-DD)
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      // Bước 1: Tạo booking thật
      console.log("🔵 Creating booking...", { dateStr, timeSlot: slots[selectedSlot].time });
      const bookingResponse = await bookingService.createBooking({
        facilityId,
        facilityName,
        facilityLocation,
        date: dateStr,
        timeSlot: slots[selectedSlot].time,
        price: slots[selectedSlot].price,
      });

      const bookingId = bookingResponse.booking._id;
      console.log("✅ Booking created:", bookingId);

      // Format date không dấu cho VNPay
      const dateDisplay = selectedDate.toLocaleDateString("en-GB"); // DD/MM/YYYY

      // Bước 2: Tạo payment
      console.log("🔵 Creating payment...");
      const paymentResponse = await api.post("/payment", {
        type: "booking",
        referenceId: bookingId,
        amount: slots[selectedSlot].price,
        description: `Thanh toan dat san ${facilityName} ngay ${dateDisplay} - ${slots[selectedSlot].time}`,
      });

      // Bước 3: Lấy URL VNPay và redirect
      const paymentUrl = paymentResponse.data.paymentUrl;
      console.log("✅ Redirecting to VNPay...");
      window.location.href = paymentUrl;
    } catch (error: any) {
      console.error("Lỗi khi đặt sân:", error);
      alert(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi đặt sân. Vui lòng thử lại."
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pt-4">
      <PageHeader
        title="Đặt sân thể thao"
        subtitle="Chọn ngày và khung giờ để đặt sân"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Tổng số đơn đặt" value={String(stats.total)} />
        <StatCard title="Đơn đã xác nhận" value={String(stats.confirmed)} />
        <StatCard title="Đơn chờ thanh toán" value={String(stats.pending)} />
        <StatCard title="Đơn bị hủy" value={String(stats.cancelled)} />
      </div>

      {/* Lịch + Khung giờ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Calendar */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-800">
            <CalendarDays className="h-4 w-4 text-blue-500" />
            Chọn ngày đặt sân
          </h3>

          <div className="calendar-wrapper">
            <Calendar
              onChange={(value) => setSelectedDate(value as Date)}
              value={selectedDate}
              locale="vi-VN"
              minDate={new Date()}
            />
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-md bg-blue-50 p-3 text-sm text-blue-700">
            <CalendarDays className="h-4 w-4" />
            Ngày đã chọn:{" "}
            <span className="font-medium">
              {selectedDate.toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Time slots */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-800">
            <Clock className="h-4 w-4 text-blue-500" />
            Chọn khung giờ
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {loading ? (
              <div className="col-span-3 flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : (
              slots.map((slot, index) => {
                const isSelected = selectedSlot === index;
                const isBooked = slot.status === "booked";
                const isLocked = slot.status === "locked";
                const isPast = slot.status === "past";
                const isDisabled = isBooked || isLocked || isPast;

                return (
                  <button
                    key={slot.time}
                    onClick={() => !isDisabled && setSelectedSlot(index)}
                    disabled={isDisabled}
                    className={`rounded-md border py-2 text-sm font-medium transition ${
                      isLocked
                        ? "cursor-not-allowed border-red-200 bg-red-50 text-red-400"
                        : isBooked
                          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                          : isPast
                            ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300 line-through"
                            : isSelected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "bg-gray-50 text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                    } `}
                  >
                    {slot.time}
                    {isLocked && (
                      <span className="block text-xs text-red-400">Bị khóa</span>
                    )}
                    {isBooked && (
                      <span className="block text-xs text-gray-400">Đã đặt</span>
                    )}
                    {isPast && (
                      <span className="block text-xs text-gray-300">Đã qua</span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {selectedSlot !== null && (
            <div className="mt-4 flex items-center gap-2 rounded-md bg-blue-50 p-3 text-sm text-blue-700">
              <CheckCircle2 className="h-4 w-4" />
              Đã chọn khung giờ:{" "}
              <span className="font-medium">{slots[selectedSlot].time}</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal xác nhận */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative w-[400px] rounded-xl bg-white p-6 shadow-lg">
            <h3 className="mb-1 text-lg font-semibold text-gray-800">
              Xác nhận đặt sân
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              Vui lòng kiểm tra thông tin đặt sân trước khi xác nhận
            </p>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium text-gray-500">Sân:</span>{" "}
                {facilityName}
              </p>
              <p>
                <span className="font-medium text-gray-500">Vị trí:</span>{" "}
                {facilityLocation}
              </p>
              <p>
                <span className="font-medium text-gray-500">Ngày đặt:</span>{" "}
                {selectedDate.toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
              <p>
                <span className="font-medium text-gray-500">Khung giờ:</span>{" "}
                {selectedSlot !== null ? slots[selectedSlot].time : ""}
              </p>
              <p>
                <span className="font-medium text-gray-500">Thời lượng:</span>{" "}
                1.0 giờ
              </p>
            </div>

            <hr className="my-4" />

            <div className="flex items-center justify-between text-base font-medium">
              <span>Tổng thanh toán:</span>
              <span className="text-blue-600">
                {selectedSlot !== null
                  ? slots[selectedSlot].price.toLocaleString("vi-VN")
                  : 0}
                đ
              </span>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-md border px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleBookingSubmit}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isProcessing ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận đặt sân"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nút đặt sân */}
      {selectedSlot !== null && !showConfirm && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowConfirm(true)}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Xác nhận đặt sân
          </button>
        </div>
      )}
    </div>
  );
};

export default Booking;
