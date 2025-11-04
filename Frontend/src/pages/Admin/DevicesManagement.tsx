import { Package, Wrench, CheckCircle2, AlertTriangle } from "lucide-react";
import StatCard from "@/components/Admin/StatCard";
import PageHeader from "@/components/Admin/PageHeader";
import { useState } from "react";

type DeviceStatus = "Tốt" | "Khá" | "Cần sửa";

interface Device {
  name: string;
  type: string;
  location: string;
  total: number;
  available: number;
  borrowed?: number;
  broken: number;
  lastCheck: string;
  status: DeviceStatus;
}

// Dữ liệu kho hàng
const devices: Device[] = [
  { name: "Vợt Tennis Wilson", type: "Tennis", location: "Sân A1", total: 6, available: 2, borrowed: 2, broken: 1, lastCheck: "10/9/2025", status: "Tốt" },
  { name: "Bóng Tennis Dunlop", type: "Tennis", location: "Tủ B1", total: 6, available: 2, borrowed: 2, broken: 1, lastCheck: "10/9/2025", status: "Khá" },
  { name: "Vợt Cầu Lông Yonex", type: "Badminton", location: "Tủ A2", total: 6, available: 2, borrowed: 2, broken: 1, lastCheck: "10/9/2025", status: "Tốt" },
  { name: "Vợt Tennis Wilson", type: "Tennis", location: "Sân A1", total: 6, available: 2, borrowed: 2, broken: 1, lastCheck: "10/9/2025", status: "Tốt" },
  { name: "Bóng Tennis Dunlop", type: "Tennis", location: "Tủ B1", total: 6, available: 2, borrowed: 2, broken: 1, lastCheck: "10/9/2025", status: "Khá" },
  { name: "Vợt Cầu Lông Yonex", type: "Badminton", location: "Tủ A2", total: 6, available: 2, borrowed: 2, broken: 1, lastCheck: "10/9/2025", status: "Tốt" },
];

// Dữ liệu cảnh báo
const lowStock = [
  { name: "Lưới bóng chuyền", remaining: 2 },
  { name: "Giày Thể Thao (Size 39–42)", remaining: 3 },
];

const maintenance = [
  { name: "Vợt Tennis Wilson", issue: 3 },
  { name: "Vợt Cầu Lông Yonex", issue: 2 },
  { name: "Bóng Tennis Dunlop", issue: 4 },
];

// Dữ liệu tab “Cho mượn”
const loanList = [
  { name: "Vợt Tennis Wilson", user: "Nguyễn Văn A", qty: 2, status: "Đang mượn", borrow: "24/05/2025", return: "27/05/2025" },
  { name: "Vợt Tennis Wilson", user: "Nguyễn Văn A", qty: 2, status: "Đã trả", borrow: "24/05/2025", return: "27/05/2025" },
  { name: "Vợt Tennis Wilson", user: "Nguyễn Văn A", qty: 2, status: "Quá hạn", borrow: "24/05/2025", return: "27/05/2025" },
];

// Dữ liệu tab “Bảo trì”
const maintenanceList = [
  { name: "Vợt Tennis Wilson", location: "Tennis - Sân Thể Thao - Tủ A1", qty: 2, status: "Tốt", last: "27/05/2025" },
  { name: "Vợt Cầu Lông Yonex", location: "Badminton - Tủ B1", qty: 3, status: "Khá", last: "25/05/2025" },
  { name: "Giày Thể Thao (Size 39)", location: "Footwear - Tủ D1", qty: 1, status: "Cần sửa", last: "22/05/2025" },
];

// ===============================================================

const DeviceCard = ({ d }: { d: Device }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition">
    <div className="flex justify-between items-start mb-3">
      <div className="min-w-0">
        <h4 className="font-semibold text-gray-800 truncate">{d.name}</h4>
        <p className="text-sm text-gray-700">{d.type}</p>
        <p className="text-xs text-gray-500">{d.location}</p>
      </div>
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          d.status === "Tốt"
            ? "bg-green-100 text-green-700"
            : d.status === "Khá"
            ? "bg-blue-100 text-blue-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {d.status}
      </span>
    </div>

    <div className="grid grid-cols-3 gap-2 text-sm mt-2">
      <div><p className="text-xs text-gray-600">Tổng số</p><p className="font-semibold text-gray-800">{d.total}</p></div>
      <div><p className="text-xs text-gray-600">Có sẵn</p><p className="font-semibold text-gray-800">{d.available}</p></div>
      <div><p className="text-xs text-gray-600">Hỏng</p><p className="font-semibold text-gray-800">{d.broken}</p></div>
    </div>

    <p className="text-xs text-gray-600 mt-3">
      Bảo trì lần cuối: <span className="text-gray-800 font-medium">{d.lastCheck}</span>
    </p>

    <div className="flex gap-2 mt-4">
      <button className="flex-1 border border-gray-300 rounded-md text-sm py-1 text-gray-700 font-medium hover:bg-gray-50">Chỉnh sửa</button>
      <button className="flex-1 border border-gray-300 rounded-md text-sm py-1 text-gray-700 font-medium hover:bg-gray-50">Cập nhật</button>
    </div>
  </div>
);

const DevicesManagement = () => {
  const [tab, setTab] = useState<"stock" | "loan" | "maint">("stock");

  const stats = [
    { id: 1, title: "Loại dụng cụ", value: "7", color: "text-blue-600", icon: <div className="p-2 bg-blue-50 rounded-lg"><Package className="w-5 h-5 text-blue-600" /></div> },
    { id: 2, title: "Tổng số lượng", value: "99", color: "text-indigo-600", icon: <div className="p-2 bg-indigo-50 rounded-lg"><CheckCircle2 className="w-5 h-5 text-indigo-600" /></div> },
    { id: 3, title: "Đang cho mượn", value: "36", color: "text-yellow-600", icon: <div className="p-2 bg-yellow-50 rounded-lg"><Package className="w-5 h-5 text-yellow-600" /></div> },
    { id: 4, title: "Hỏng / Bảo trì", value: "12", color: "text-red-600", icon: <div className="p-2 bg-red-50 rounded-lg"><Wrench className="w-5 h-5 text-red-600" /></div> },
  ];

  const countStock = devices.length;
  const countLoan = loanList.length;
  const countMaint = maintenanceList.length;

  return (
    <div className="flex flex-col gap-8 pt-4">
      {/* Header */}
      
      <PageHeader
        title="Quản lý dụng cụ"
        subtitle="Theo dõi và quản lý dụng cụ thể thao trong sân"
      />
      
      {/* Thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((s) => (
          <StatCard key={s.id} title={s.title} value={s.value} colorClass={s.color} icon={s.icon} />
        ))}
      </div>

      {/* Cảnh báo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-yellow-300 bg-yellow-50 rounded-xl p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-yellow-700 font-semibold mb-3">
            <AlertTriangle className="w-5 h-5" /> Cảnh báo hết hàng
          </h3>
          {lowStock.map((it) => (
            <div key={it.name} className="flex justify-between text-sm text-gray-700 mb-1">
              <span>{it.name}</span>
              <span className="bg-yellow-100 px-2 py-0.5 rounded-md text-yellow-700 font-medium">{it.remaining} còn lại</span>
            </div>
          ))}
        </div>

        <div className="border border-red-300 bg-red-50 rounded-xl p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-red-700 font-semibold mb-3">
            <Wrench className="w-5 h-5" /> Cần bảo trì
          </h3>
          {maintenance.map((it) => (
            <div key={it.name} className="flex justify-between text-sm text-gray-700 mb-1">
              <span>{it.name}</span>
              <span className="bg-red-100 px-2 py-0.5 rounded-md text-red-700 font-medium">{it.issue} hỏng</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        {[
          { id: "stock", label: "Kho hàng", count: countStock },
          { id: "loan", label: "Cho mượn", count: countLoan },
          { id: "maint", label: "Bảo trì", count: countMaint },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-3 py-1.5 text-sm border rounded-md flex items-center gap-2 font-medium transition ${
              tab === t.id
                ? "bg-gray-100 text-gray-900 border-gray-300"
                : "text-gray-800 bg-white border-gray-300 hover:bg-gray-50"
            }`}
          >
            {t.label}
            <span className={`text-xs px-2 py-0.5 rounded-full ${tab === t.id ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600"}`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Kho hàng */}
      {tab === "stock" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {devices.map((d) => (
            <DeviceCard key={d.name} d={d} />
          ))}
        </div>
      )}

      {/* Cho mượn */}
      {tab === "loan" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Danh sách cho mượn</h2>
          <p className="text-sm text-gray-500 mb-4">Theo dõi tình trạng mượn/trả dụng cụ</p>
          <div className="space-y-3">
            {loanList.map((it) => (
              <div key={it.name + it.status} className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div>
                  <p className="font-medium text-gray-800 flex items-center gap-2">
                    {it.name}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        it.status === "Đang mượn"
                          ? "bg-blue-100 text-blue-700"
                          : it.status === "Đã trả"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {it.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-3 mt-1">
                    👤 {it.user} <span>📦 SL: {it.qty}</span>
                    <span>🕒 Mượn: {it.borrow}</span>
                    <span>↩️ Trả: {it.return}</span>
                  </p>
                </div>
                {it.status === "Đang mượn" && (
                  <button className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-blue-700">
                    Xác nhận trả
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bảo trì */}
      {tab === "maint" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Lịch bảo trì dụng cụ</h2>
          <p className="text-sm text-gray-500 mb-4">Theo dõi lịch bảo hành và tình trạng thiết bị</p>
          <div className="space-y-3">
            {maintenanceList.map((it) => (
              <div key={it.name} className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                <div>
                  <p className="font-medium text-gray-800 flex items-center gap-2">
                    {it.name}
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">Đang mượn</span>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-3 mt-1">
                    📍 {it.location} <span>📦 SL: {it.qty}</span>
                    <span>🕒 Bảo hành cuối: {it.last}</span>
                  </p>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-md font-medium ${
                    it.status === "Tốt"
                      ? "bg-green-100 text-green-700"
                      : it.status === "Khá"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {it.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DevicesManagement;
