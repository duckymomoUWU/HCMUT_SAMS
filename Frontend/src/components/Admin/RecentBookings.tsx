import { Clock } from "lucide-react";

const bookings = [
  {
    time: "6:00 - 8:00",
    name: "Nguyễn Văn A",
    date: "04/10/2025",
    price: "200,000 VNĐ",
    status: "confirmed",
  },
  {
    time: "6:00 - 8:00",
    name: "Nguyễn Văn A",
    date: "04/10/2025",
    price: "200,000 VNĐ",
    status: "pending",
  },
  {
    time: "6:00 - 8:00",
    name: "Nguyễn Văn A",
    date: "04/10/2025",
    price: "200,000 VNĐ",
    status: "cancelled",
  },
];

const statusConfig = {
  confirmed: { bg: "bg-[#A5FEA9]", text: "Đã xác nhận" },
  pending: { bg: "bg-[yellow]", text: "Chờ xử lí" },
  cancelled: { bg: "bg-[red]", text: "Đã hủy" },
};

const RecentBookings = () => {
  return (
    <div className="rounded-[20px] border-2 bg-white p-6">
      <div className="mb-6 flex items-center gap-4">
        <Clock className="h-[25px] w-[25px] text-black" />
        <h3 className="text-base leading-[10px] font-normal text-black">
          Đặt lịch gần đây
        </h3>
      </div>

      <div className="space-y-[31px]">
        {bookings.map((booking, index) => {
          const config =
            statusConfig[booking.status as keyof typeof statusConfig];

          return (
            <div
              key={index}
              className="relative min-h-[95px] rounded-lg bg-[#d9d9d9] p-[8px_21px_21px]"
            >
              <div className="mb-[16px] pt-[5px] text-base leading-[20px] font-normal text-black">
                {booking.time}
              </div>
              <div className="mb-[20px] text-base leading-[10px] font-normal text-black">
                {booking.name}
              </div>
              <div className="text-base leading-[10px] font-normal text-black">
                {booking.date}
              </div>

              <div
                className={`absolute top-[23px] right-[80px] rounded-lg px-[6px] ${config.bg}`}
              >
                <span className="text-[12px] font-bold text-black">
                  {config.text}
                </span>
              </div>

              <div className="absolute top-[60px] right-[21px] text-sm leading-[10px] font-bold text-black">
                {booking.price}
              </div>
            </div>
          );
        })}
      </div>

      <button className="mt-15 w-full rounded border border-[gray] bg-white py-2 text-sm leading-[10px] font-normal text-black transition-colors hover:bg-gray-50">
        Xem tất cả lịch đặt
      </button>
    </div>
  );
};
export default RecentBookings;
