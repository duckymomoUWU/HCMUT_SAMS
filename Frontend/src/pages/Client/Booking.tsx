import { useState } from "react";
import { CalendarDays, Clock, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/Admin/PageHeader";
import StatCard from "@/components/Admin/StatCard";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((s) => (
          <StatCard key={s.id} title={s.title} value={s.value} />
        ))}
      </div>

      {/* Lịch + Khung giờ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-blue-500" />
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

          <div className="mt-4 p-3 rounded-md bg-blue-50 text-blue-700 text-sm flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
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
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-blue-500" />
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
                  className={`
                    py-2 text-sm border rounded-md transition font-medium 
                    ${isBooked
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                      : isMaintenance
                      ? "bg-yellow-50 text-yellow-700 cursor-not-allowed border-yellow-100"
                      : isSelected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-50 text-gray-700 hover:bg-blue-50 hover:border-blue-400"}
                  `}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>

          {selectedSlot !== null && (
            <div className="mt-4 text-sm text-blue-700 bg-blue-50 p-3 rounded-md flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Đã chọn khung giờ:{" "}
              <span className="font-medium">{slots[selectedSlot].time}</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal xác nhận */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[400px] p-6 relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Xác nhận đặt sân
            </h3>
            <p className="text-sm text-gray-500 mb-4">
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
                {selectedSlot !== null ? slots[selectedSlot].time : ''}
              </p>
              <p>
                <span className="font-medium text-gray-500">Thời lượng:</span> 1.0 giờ
              </p>
              <p>
                <span className="font-medium text-gray-500">Loại sân:</span>{" "}
                Sân thể thao đa năng
              </p>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between items-center text-base font-medium">
              <span>Tổng thanh toán:</span>
              <span className="text-blue-600">
                {selectedSlot !== null ? slots[selectedSlot].price.toLocaleString("vi-VN") : 0}đ
              </span>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  alert("Đặt sân thành công!");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
              >
                Xác nhận đặt sân
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nút đặt sân */}
      {selectedSlot !== null && !showConfirm && (
        <div className="flex justify-end mt-6">
          <button
            onClick={() => setShowConfirm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
          >
            Xác nhận đặt sân
          </button>
        </div>
      )}
    </div>
  );
};

export default Booking;
