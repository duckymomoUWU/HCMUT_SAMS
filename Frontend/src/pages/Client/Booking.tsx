import { useState } from "react";
import { CalendarDays, Clock, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/Admin/PageHeader";
import StatCard from "@/components/Admin/StatCard";
import Calendar from "react-calendar";
import "react-calendar/dist/calendar.css";
import "@/pages/Client/calendar.css";

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const slots = [
    { time: "07:00 - 08:00", price: 180000, status: "available" },
    { time: "08:00 - 09:00", price: 180000, status: "available" },
    { time: "09:00 - 10:00", price: 180000, status: "booked" },
    { time: "10:00 - 11:00", price: 180000, status: "maintenance" },
    { time: "13:00 - 14:00", price: 180000, status: "available" },
    { time: "14:00 - 15:00", price: 180000, status: "available" },
    { time: "15:00 - 16:00", price: 180000, status: "booked" },
    { time: "16:00 - 17:00", price: 180000, status: "available" },
    { time: "17:00 - 18:00", price: 180000, status: "available" },
    { time: "18:00 - 19:00", price: 180000, status: "booked" },
    { time: "19:00 - 20:00", price: 180000, status: "available" },
    { time: "20:00 - 21:00", price: 180000, status: "available" },
  ];

  const stats = [
    { id: 1, title: "Tổng số đơn đặt", value: "42" },
    { id: 2, title: "Đơn đã duyệt", value: "35" },
    { id: 3, title: "Đơn đang xử lý", value: "5" },
    { id: 4, title: "Đơn bị hủy", value: "2" },
  ];

  return (
    <div className="flex flex-col gap-8 pt-4">
      <PageHeader
        title="Đặt sân thể thao"
        subtitle="Chọn ngày và khung giờ để đặt sân"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.id} title={s.title} value={s.value} />
        ))}
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
            {slots.map((slot, index) => {
              const isSelected = selectedSlot === index;
              const isBooked = slot.status === "booked";
              const isMaintenance = slot.status === "maintenance";

              return (
                <button
                  key={slot.time}
                  onClick={() =>
                    !isBooked && !isMaintenance && setSelectedSlot(index)
                  }
                  disabled={isBooked || isMaintenance}
                  className={`rounded-md border py-2 text-sm font-medium transition ${
                    isBooked
                      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                      : isMaintenance
                        ? "cursor-not-allowed border-yellow-100 bg-yellow-50 text-yellow-700"
                        : isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "bg-gray-50 text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                  } `}
                >
                  {slot.time}
                </button>
              );
            })}
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
              <p>
                <span className="font-medium text-gray-500">Loại sân:</span> Sân
                thể thao đa năng
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
                onClick={() => {
                  setShowConfirm(false);
                  alert("Đặt sân thành công!");
                }}
                className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                Xác nhận đặt sân
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
