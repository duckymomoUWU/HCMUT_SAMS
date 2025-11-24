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
  {
    name: "Vợt Tennis Wilson",
    type: "Tennis",
    location: "Sân A1",
    total: 6,
    available: 2,
    borrowed: 2,
    broken: 1,
    lastCheck: "10/9/2025",
    status: "Tốt",
  },
  {
    name: "Bóng Tennis Dunlop",
    type: "Tennis",
    location: "Tủ B1",
    total: 6,
    available: 2,
    borrowed: 2,
    broken: 1,
    lastCheck: "10/9/2025",
    status: "Khá",
  },
  {
    name: "Vợt Cầu Lông Yonex",
    type: "Badminton",
    location: "Tủ A2",
    total: 6,
    available: 2,
    borrowed: 2,
    broken: 1,
    lastCheck: "10/9/2025",
    status: "Tốt",
  },
  {
    name: "Vợt Tennis Wilson",
    type: "Tennis",
    location: "Sân A1",
    total: 6,
    available: 2,
    borrowed: 2,
    broken: 1,
    lastCheck: "10/9/2025",
    status: "Tốt",
  },
  {
    name: "Bóng Tennis Dunlop",
    type: "Tennis",
    location: "Tủ B1",
    total: 6,
    available: 2,
    borrowed: 2,
    broken: 1,
    lastCheck: "10/9/2025",
    status: "Khá",
  },
  {
    name: "Vợt Cầu Lông Yonex",
    type: "Badminton",
    location: "Tủ A2",
    total: 6,
    available: 2,
    borrowed: 2,
    broken: 1,
    lastCheck: "10/9/2025",
    status: "Tốt",
  },
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
  {
    name: "Vợt Tennis Wilson",
    user: "Nguyễn Văn A",
    qty: 2,
    status: "Đang mượn",
    borrow: "24/05/2025",
    return: "27/05/2025",
  },
  {
    name: "Vợt Tennis Wilson",
    user: "Nguyễn Văn A",
    qty: 2,
    status: "Đã trả",
    borrow: "24/05/2025",
    return: "27/05/2025",
  },
  {
    name: "Vợt Tennis Wilson",
    user: "Nguyễn Văn A",
    qty: 2,
    status: "Quá hạn",
    borrow: "24/05/2025",
    return: "27/05/2025",
  },
];

// Dữ liệu tab “Bảo trì”
const maintenanceList = [
  {
    name: "Vợt Tennis Wilson",
    location: "Tennis - Sân Thể Thao - Tủ A1",
    qty: 2,
    status: "Tốt",
    last: "27/05/2025",
  },
  {
    name: "Vợt Cầu Lông Yonex",
    location: "Badminton - Tủ B1",
    qty: 3,
    status: "Khá",
    last: "25/05/2025",
  },
  {
    name: "Giày Thể Thao (Size 39)",
    location: "Footwear - Tủ D1",
    qty: 1,
    status: "Cần sửa",
    last: "22/05/2025",
  },
];

// ===============================================================

const DeviceCard = ({ d }: { d: Device }) => (
  <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
    <div className="mb-3 flex items-start justify-between">
      <div className="min-w-0">
        <h4 className="truncate font-semibold text-gray-800">{d.name}</h4>
        <p className="text-sm text-gray-700">{d.type}</p>
        <p className="text-xs text-gray-500">{d.location}</p>
      </div>
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
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

    <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
      <div>
        <p className="text-xs text-gray-600">Tổng số</p>
        <p className="font-semibold text-gray-800">{d.total}</p>
      </div>
      <div>
        <p className="text-xs text-gray-600">Có sẵn</p>
        <p className="font-semibold text-gray-800">{d.available}</p>
      </div>
      <div>
        <p className="text-xs text-gray-600">Hỏng</p>
        <p className="font-semibold text-gray-800">{d.broken}</p>
      </div>
    </div>

    <p className="mt-3 text-xs text-gray-600">
      Bảo trì lần cuối:{" "}
      <span className="font-medium text-gray-800">{d.lastCheck}</span>
    </p>

    <div className="mt-4 flex gap-2">
      <button className="flex-1 rounded-md border border-gray-300 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
        Chỉnh sửa
      </button>
      <button className="flex-1 rounded-md border border-gray-300 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
        Cập nhật
      </button>
    </div>
  </div>
);

const DevicesManagement = () => {
  const [tab, setTab] = useState<"stock" | "loan" | "maint">("stock");

  const stats = [
    {
      id: 1,
      title: "Loại dụng cụ",
      value: "7",
      color: "text-blue-600",
      icon: (
        <div className="rounded-lg bg-blue-50 p-2">
          <Package className="h-5 w-5 text-blue-600" />
        </div>
      ),
    },
    {
      id: 2,
      title: "Tổng số lượng",
      value: "99",
      color: "text-indigo-600",
      icon: (
        <div className="rounded-lg bg-indigo-50 p-2">
          <CheckCircle2 className="h-5 w-5 text-indigo-600" />
        </div>
      ),
    },
    {
      id: 3,
      title: "Đang cho mượn",
      value: "36",
      color: "text-yellow-600",
      icon: (
        <div className="rounded-lg bg-yellow-50 p-2">
          <Package className="h-5 w-5 text-yellow-600" />
        </div>
      ),
    },
    {
      id: 4,
      title: "Hỏng / Bảo trì",
      value: "12",
      color: "text-red-600",
      icon: (
        <div className="rounded-lg bg-red-50 p-2">
          <Wrench className="h-5 w-5 text-red-600" />
        </div>
      ),
    },
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.id}
            title={s.title}
            value={s.value}
            colorClass={s.color}
            icon={s.icon}
          />
        ))}
      </div>

      {/* Cảnh báo */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-yellow-700">
            <AlertTriangle className="h-5 w-5" /> Cảnh báo hết hàng
          </h3>
          {lowStock.map((it) => (
            <div
              key={it.name}
              className="mb-1 flex justify-between text-sm text-gray-700"
            >
              <span>{it.name}</span>
              <span className="rounded-md bg-yellow-100 px-2 py-0.5 font-medium text-yellow-700">
                {it.remaining} còn lại
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-red-300 bg-red-50 p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-red-700">
            <Wrench className="h-5 w-5" /> Cần bảo trì
          </h3>
          {maintenance.map((it) => (
            <div
              key={it.name}
              className="mb-1 flex justify-between text-sm text-gray-700"
            >
              <span>{it.name}</span>
              <span className="rounded-md bg-red-100 px-2 py-0.5 font-medium text-red-700">
                {it.issue} hỏng
              </span>
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
            className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition ${
              tab === t.id
                ? "border-gray-300 bg-gray-100 text-gray-900"
                : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
            }`}
          >
            {t.label}
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${tab === t.id ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-600"}`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Kho hàng */}
      {tab === "stock" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {devices.map((d) => (
            <DeviceCard key={d.name} d={d} />
          ))}
        </div>
      )}

      {/* Cho mượn */}
      {tab === "loan" && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-gray-800">
            Danh sách cho mượn
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            Theo dõi tình trạng mượn/trả dụng cụ
          </p>
          <div className="space-y-3">
            {loanList.map((it) => (
              <div
                key={it.name + it.status}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
              >
                <div>
                  <p className="flex items-center gap-2 font-medium text-gray-800">
                    {it.name}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
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
                  <p className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                    👤 {it.user} <span>📦 SL: {it.qty}</span>
                    <span>🕒 Mượn: {it.borrow}</span>
                    <span>↩️ Trả: {it.return}</span>
                  </p>
                </div>
                {it.status === "Đang mượn" && (
                  <button className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
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
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-gray-800">
            Lịch bảo trì dụng cụ
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            Theo dõi lịch bảo hành và tình trạng thiết bị
          </p>
          <div className="space-y-3">
            {maintenanceList.map((it) => (
              <div
                key={it.name}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
              >
                <div>
                  <p className="flex items-center gap-2 font-medium text-gray-800">
                    {it.name}
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      Đang mượn
                    </span>
                  </p>
                  <p className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                    📍 {it.location} <span>📦 SL: {it.qty}</span>
                    <span>🕒 Bảo hành cuối: {it.last}</span>
                  </p>
                </div>
                <span
                  className={`rounded-md px-3 py-1 text-sm font-medium ${
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
