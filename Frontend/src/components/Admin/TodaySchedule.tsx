import { Clock } from "lucide-react";

const schedules = [
  {
    time: "6:00 - 8:00",
    name: "Nguyễn Văn A - Bóng đá",
    status: "in-use",
  },
  {
    time: "6:00 - 8:00",
    name: "Nguyễn Văn A - Bóng đá",
    status: "available",
  },
  {
    time: "6:00 - 8:00",
    name: "Nguyễn Văn A - Bóng đá",
    status: "pending",
  },
  {
    time: "6:00 - 8:00",
    name: "Nguyễn Văn A - Bóng đá",
    status: "maintenance",
  },
];

const statusConfig = {
  "in-use": { bg: "bg-[#51A4F1]", text: "Đang sử dụng" },
  available: { bg: "bg-[#A5FEA9]", text: "Trống" },
  pending: { bg: "bg-[#F6EB61]", text: "Chờ xác nhận" },
  maintenance: { bg: "bg-[#FF6B6B]", text: "Bảo trì" },
};

const TodaySchedule = () => {
  return (
    <div className="rounded-[20px] border-2 bg-white p-6">
      <div className="mb-6 flex items-center gap-4">
        <Clock className="h-[25px] w-[25px] text-black" />
        <h3 className="text-base leading-[10px] font-normal text-black">
          Lịch khung giờ hôm nay
        </h3>
      </div>

      <div className="space-y-[33px]">
        {schedules.map((schedule, index) => {
          const config =
            statusConfig[schedule.status as keyof typeof statusConfig];

          return (
            <div
              key={index}
              className="relative min-h-[63px] rounded-lg bg-[#d9d9d9] p-[0_14px_26px]"
            >
              <div className="mb-[16px] pt-[10px] text-base leading-[20px] font-normal text-black">
                {schedule.time}
              </div>
              <div className="text-base leading-[10px] font-normal text-black">
                {schedule.name}
              </div>

              <div
                className={`r absolute top-[23px] right-[15px] rounded-lg px-[10px] py-[2px] ${config.bg} flex min-h-[20px] min-w-[60px] justify-center`}
              >
                <span className="text-[12px] font-bold text-black">
                  {config.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <button className="border-dashboard-gray-text mt-6 w-full rounded border bg-white py-2 text-sm leading-[10px] font-normal text-black transition-colors hover:bg-gray-50">
        Xem tất cả
      </button>
    </div>
  );
};
export default TodaySchedule;
