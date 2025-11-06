import { Package } from "lucide-react";

const equipmentData = [
  { name: "Bóng rổ", used: 15, total: 20 },
  { name: "Bóng rổ", used: 15, total: 20 },
  { name: "Bóng rổ", used: 15, total: 20 },
  { name: "Bóng rổ", used: 15, total: 20 },
];

const EquipmentStatus = () => {
  return (
    <div className="border-dashboard-gray-border rounded-lg border-2 bg-white p-6">
      <div className="mb-6 flex items-center gap-3">
        <Package className="h-[29px] w-[30px] text-black" />
        <div>
          <h3 className="mb-[12px] text-base leading-[10px] font-normal text-black">
            Tình trạng thiết bị
          </h3>
          <p className="text-sm leading-[10px] font-normal text-black">
            Thiết bị đã thuê/tổng số
          </p>
        </div>
      </div>

      <div className="space-y-[17px]">
        {equipmentData.map((item, index) => {
          const percentage = (item.used / item.total) * 100;

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-base leading-[10px] font-normal text-black">
                  {item.name}
                </span>
                <span className="text-base leading-[10px] font-normal text-black">
                  {item.used}/{item.total}
                </span>
              </div>
              <div className="relative h-[10px] overflow-hidden rounded-lg bg-[#b7e0ff]">
                <div
                  className="absolute top-0 left-0 h-full rounded-lg bg-[#51A4F1]"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default EquipmentStatus;
