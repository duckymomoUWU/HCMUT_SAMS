import { TrendingUp } from "lucide-react";

const data = [
  { day: "T2", value: 4 },
  { day: "T3", value: 5 },
  { day: "T4", value: 6 },
  { day: "T5", value: 7 },
  { day: "T6", value: 5 },
  { day: "T7", value: 6 },
  { day: "CN", value: 4 },
];

const WeeklyChart = () => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="border-dashboard-gray-border rounded-lg border-2 bg-white p-4 md:p-6">
      <div className="mb-2 flex items-center gap-3">
        <TrendingUp className="h-6 w-6 text-black md:h-[29px] md:w-[30px]" />
        <h3 className="text-sm leading-tight font-normal text-black md:text-base md:leading-[10px]">
          Số lượt đặt sân trong tuần
        </h3>
      </div>

      <p className="mb-4 ml-0 text-xs leading-tight font-normal text-black md:mb-6 md:ml-[52px] md:text-sm md:leading-[10px]">
        Số lần đặt sân theo từng ngày trong tuần
      </p>

      <div className="flex h-[180px] items-end justify-around gap-2 px-2 md:h-[225px] md:gap-4 md:px-8">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 140;
          return (
            <div
              key={index}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div
                className="w-full rounded-t bg-[#51A4F1]"
                style={{ height: `${height}px` }}
              ></div>
              <span className="text-xs font-normal text-black md:text-sm">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pl-2 text-xs text-gray-500 md:pl-8">
        <div className="flex items-center gap-2">
          <div className="bg-dashboard-cyan h-2 w-2 rounded"></div>
          <span>Số lượt đặt</span>
        </div>
      </div>
    </div>
  );
};
export default WeeklyChart;
