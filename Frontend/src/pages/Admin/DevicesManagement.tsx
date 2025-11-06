import { useState } from "react";
import Sidebar from "../../components/Admin/SideBar";
import Header from "../../components/Admin/Header";
import StatsCard from "../../components/Admin/StatsCard";
import {
  Package,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Undo2,
  User,
} from "lucide-react";

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
    status: "Tốt",
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
    name: "Quả cầu lông Victor",
    type: "Badminton",
    location: "Tủ C3",
    total: 6,
    available: 2,
    borrowed: 2,
    broken: 1,
    lastCheck: "10/9/2025",
    status: "Tốt",
  },
  {
    name: "Lưới bóng chuyền Mikasa",
    type: "Volleyball",
    location: "Kho C",
    total: 6,
    available: 2,
    borrowed: 2,
    broken: 1,
    lastCheck: "10/9/2025",
    status: "Khá",
  },
  {
    name: "Giày Thể Thao (Size 39)",
    type: "Footwear",
    location: "Tủ D1",
    total: 6,
    available: 2,
    borrowed: 2,
    broken: 1,
    lastCheck: "10/9/2025",
    status: "Tốt",
  },
];

const lowStock = [
  { name: "Lưới bóng chuyền", remaining: 2 },
  { name: "Giày Thể Thao (Size 39–42)", remaining: 3 },
];

const maintenance = [
  { name: "Vợt Tennis Wilson", issue: 3 },
  { name: "Vợt Cầu Lông Yonex", issue: 2 },
  { name: "Bóng Tennis Dunlop", issue: 4 },
  { name: "Lưới bóng chuyền", issue: 1 },
];

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

const DeviceCard = ({ d }: { d: Device }) => (
  <div className="flex flex-col justify-between rounded-xl border bg-white p-5 shadow-sm">
    <div className="mb-3 flex items-start justify-between">
      <div className="min-w-0">
        <h4 className="truncate font-semibold text-black">{d.name}</h4>
        <p className="text-sm text-black">{d.type}</p>
        <p className="text-xs text-black">{d.location}</p>
      </div>
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          d.status === "Tốt"
            ? "bg-[rgba(0,255,38,0.17)] text-[#0A5A28]"
            : d.status === "Khá"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {d.status}
      </span>
    </div>

    <div className="mt-2 grid grid-cols-4 gap-2 text-sm">
      <div>
        <p className="text-xs text-black">Tổng số</p>
        <p className="font-semibold text-black">{d.total}</p>
      </div>
      <div>
        <p className="text-xs text-black">Có sẵn</p>
        <p className="font-semibold text-black">{d.available}</p>
      </div>
      <div>
        <p className="text-xs text-black">Cho mượn</p>
        <p className="font-semibold text-black">{d.borrowed || 0}</p>
      </div>
      <div>
        <p className="text-xs text-black">Hỏng</p>
        <p className="font-semibold text-black">{d.broken}</p>
      </div>
    </div>

    <p className="mt-3 text-xs text-black">
      Bảo trì lần cuối:{" "}
      <span className="font-medium text-black">{d.lastCheck}</span>
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<"stock" | "loan" | "maintenance">("stock");

  return (
    <div className="min-h-screen bg-[#b7e63e]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 transition-all lg:ml-68">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8">
          <div className="mb-6 h-16 rounded-lg bg-[#006199] p-4">
            <h1 className="mb-2 text-2xl leading-tight font-normal md:text-[28px] md:leading-[13px]">
              Quản lý thiết bị
            </h1>
            <p className="text-xs text-white">
              Theo dõi và quản lý thiết bị thể thao trong nhà thi đấu
            </p>
          </div>

          {/* Thống kê */}
          <div className="mb-6 grid grid-cols-1 gap-4 border-[gray] sm:grid-cols-2 md:mb-8 md:gap-6 lg:grid-cols-4">
            <StatsCard
              title="Loại dụng cụ"
              value="7"
              change=""
              changeType="positive"
              icon={<Package className="h-8 w-8 text-[blue] md:h-10 md:w-10" />}
            />
            <StatsCard
              title="Tổng số lượng"
              value="99"
              change=""
              changeType="positive"
              icon={
                <CheckCircle2 className="h-8 w-8 text-[purple] md:h-10 md:w-10" />
              }
            />
            <StatsCard
              title="Đang cho mượn"
              value="36"
              change=""
              changeType="positive"
              icon={
                <Package className="h-8 w-8 text-[rgb(251,191,36)] md:h-10 md:w-10" />
              }
            />
            <StatsCard
              title="Hỏng / Bảo trì"
              value="12"
              change=""
              changeType="positive"
              icon={
                <Wrench className="h-8 w-8 text-[rgb(239,68,68)] md:h-10 md:w-10" />
              }
            />
          </div>

          {/* Alert */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-[yellow] bg-yellow-50 p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-yellow-700">
                <AlertTriangle className="h-5 w-5" /> Cảnh báo hết hàng
              </h3>
              {lowStock.map((it) => (
                <div
                  key={it.name}
                  className="mb-1 flex justify-between text-sm text-black"
                >
                  <span>{it.name}</span>
                  <span className="rounded-md bg-yellow-100 px-2 py-0.5 font-medium text-yellow-700">
                    {it.remaining} còn lại
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-[red] bg-red-50 p-5">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-red-700">
                <Wrench className="h-5 w-5" /> Cần bảo trì
              </h3>
              {maintenance.map((it) => (
                <div
                  key={it.name}
                  className="mb-1 flex justify-between text-sm text-black"
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
          <div className="mt-8 mb-6 flex flex-wrap items-center gap-3">
            {[
              { id: "stock", label: "Kho hàng" },
              { id: "loan", label: "Cho mượn" },
              { id: "maintenance", label: "Bảo trì" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as "stock" | "loan" | "maintenance")}
                className={`flex items-center gap-2 rounded-md border px-3 py-1 text-sm font-medium transition ${
                  tab === t.id
                    ? "border-[gray] bg-[#d9d9d9] text-black"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Stock */}
          {tab === "stock" && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {devices.map((d) => (
                <DeviceCard key={d.name} d={d} />
              ))}
            </div>
          )}

          {/* Loan */}
          {tab === "loan" && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-lg font-semibold text-black">
                Danh sách cho mượn
              </h2>
              <p className="mb-4 text-sm text-black">
                Theo dõi tình trạng mượn/trả dụng cụ
              </p>
              <div className="space-y-3">
                {loanList.map((it) => (
                  <div
                    key={it.name + it.status}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
                  >
                    <div>
                      <p className="flex items-center gap-2 font-medium text-black">
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
                      <p className="mt-1 flex items-center gap-3 text-sm text-black">
                        <User className="h-4 w-4" /> {it.user}{" "}
                        <Package className="h-4 w-4" /> SL: {it.qty}
                        <Clock className="h-4 w-4" /> Mượn: {it.borrow}
                        <Undo2 className="h-4 w-4" /> Trả: {it.return}
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

          {/* Maintenance */}
          {tab === "maintenance" && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-lg font-semibold text-black">
                Lịch bảo trì dụng cụ
              </h2>
              <p className="mb-4 text-sm text-black">
                Theo dõi lịch bảo hành và tình trạng thiết bị
              </p>
              <div className="space-y-3">
                {maintenanceList.map((it) => (
                  <div
                    key={it.name}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50"
                  >
                    <div>
                      <p className="flex items-center gap-2 font-medium text-black">
                        {it.name}
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                          Đang mượn
                        </span>
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-black">
                        <MapPin className="h-4 w-4" /> {it.location}{" "}
                        <Package className="h-4 w-4" /> SL: {it.qty}
                        <Clock className="h-4 w-4" /> Bảo hành cuối: {it.last}
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
        </main>
      </div>
    </div>
  );
};

export default DevicesManagement;
