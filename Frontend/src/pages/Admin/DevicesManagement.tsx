import {
  Package,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  CalendarClock,
  Hash,
  X,
  Save,
  RefreshCw,
} from "lucide-react";
import StatCard from "@/components/Admin/StatCard";
import PageHeader from "@/components/Admin/PageHeader";
import { useState, useEffect } from "react";
import equipmentService from "@/services/equipmentService";
import type { Equipment } from "@/services/equipmentService";

import { formatDate } from "@/utils/formatDate";

// --- Types ---
type DeviceStatus = "Tốt" | "Khá" | "Cần sửa";

interface EquipmentItemPopulated {
  _id: string;
  equipment: Equipment | string;
  status: "available" | "rented" | "maintenance" | "broken";
  serialNumber?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Device extends Omit<Equipment, "available"> {
  location?: string;
  borrowed?: number;
  broken?: number;
  lastCheck?: string;
  status?: DeviceStatus;
  items?: EquipmentItemPopulated[];
  total?: number;
  available?: number;
}

// Chỉnh Sửa
const EditDeviceModal = ({
  isOpen,
  onClose,
  device,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  onSave: (id: string, data: Partial<Equipment>) => Promise<void>;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (device) {
      setFormData({
        name: device.name || "",
        type: device.type || "",
        description: device.description || "",
      });
    }
  }, [device]);

  if (!isOpen || !device) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(device._id, formData);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 text-black">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">
            Chỉnh sửa thiết bị
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tên thiết bị
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Loại
            </label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mô tả / Vị trí
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// DeviceCard
const DeviceCard = ({
  d,
  onEdit,
  onRefresh,
  data,
  index,
}: {
  d: Device;
  onEdit: (d: Device) => void;
  onRefresh: () => void;
  data: Equipment[];
  index: number;
}) => {
  const items = d.items || [];
  const total = items.length;
  const availableCount = items.filter(
    (item) => item.status === "available",
  ).length;
  const rentedCount = items.filter((item) => item.status === "rented").length;
  const maintenanceCount = items.filter(
    (item) => item.status === "maintenance",
  ).length;
  const brokenCount = items.filter((item) => item.status === "broken").length;

  let status: DeviceStatus = "Tốt";
  if (brokenCount > 0 && brokenCount >= total * 0.5) {
    status = "Cần sửa";
  } else if (maintenanceCount > 0) {
    status = "Khá";
  }

  const lastUpdated =
    data.length > 0
      ? data.map((i) =>
          i.updatedAt ? formatDate(i.updatedAt) : "Chưa cập nhật",
        )
      : [];

  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0">
          <h4 className="truncate font-semibold text-gray-800">{d.name}</h4>
          <p className="text-sm text-gray-700">{d.type}</p>
          <p className="text-xs text-gray-500">
            {d.location || "Chưa xác định"}
          </p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            status === "Tốt"
              ? "bg-green-100 text-green-700"
              : status === "Khá"
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="mt-2 grid grid-cols-4 gap-2 text-sm">
        <div>
          <p className="text-xs text-gray-600">Tổng số</p>
          <p className="font-semibold text-gray-800">{total}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Có sẵn</p>
          <p className="font-semibold text-gray-800">{availableCount}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Mượn</p>
          <p className="font-semibold text-gray-800">{rentedCount}</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-600">
        Cập nhật lần cuối:{" "}
        <span className="font-medium text-gray-800">{lastUpdated[index]}</span>
      </p>

      {/* Item List Preview */}
      {items.length > 0 && (
        <div className="mt-3 rounded-lg bg-gray-50 p-2">
          <div className="space-y-1 text-xs text-gray-600">
            {items.slice(0, 2).map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="flex items-center gap-1 truncate">
                  <Hash className="h-3 w-3" />
                  {item.serialNumber || `...${item._id.slice(-4)}`}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                    item.status === "available"
                      ? "bg-green-100 text-green-700"
                      : item.status === "rented"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onEdit(d)}
          className="flex flex-1 items-center justify-center gap-1 rounded-md border border-gray-300 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Wrench className="h-3 w-3" /> Chỉnh sửa
        </button>
        <button
          onClick={onRefresh}
          className="flex flex-1 items-center justify-center gap-1 rounded-md border border-gray-300 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw className="h-3 w-3" /> Cập nhật
        </button>
      </div>
    </div>
  );
};

const DevicesManagement = () => {
  const [tab, setTab] = useState<"stock" | "loan" | "maint">("stock");
  const [devices, setDevices] = useState<Device[]>([]);
  const [equipmentItems, setEquipmentItems] = useState<
    EquipmentItemPopulated[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [data, setData] = useState<Equipment[]>([]);

  // NEW
  console.log("data", data);

  // --- DATA FETCHING ---
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [equipmentData, itemsData] = await Promise.all([
        equipmentService.getEquipments(),
        equipmentService.getEquipmentItems() as unknown as Promise<
          EquipmentItemPopulated[]
        >,
      ]);

      setData(equipmentData);

      console.log("equipmentData", equipmentData); ///

      const itemsByEquipment: Record<string, EquipmentItemPopulated[]> = {};
      itemsData.forEach((item) => {
        const eqId =
          typeof item.equipment === "object" && item.equipment !== null
            ? item.equipment._id
            : (item.equipment as string);
        if (!itemsByEquipment[eqId]) itemsByEquipment[eqId] = [];
        itemsByEquipment[eqId].push(item);
      });

      const devicesWithItems: Device[] = equipmentData.map((eq) => {
        const relatedItems = itemsByEquipment[eq._id] || [];
        return {
          ...eq,
          total: relatedItems.length,
          available: relatedItems.filter((i) => i.status === "available")
            .length,
          items: relatedItems,
        };
      });

      setDevices(devicesWithItems);
      setEquipmentItems(itemsData);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu dụng cụ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---

  // Xử lý "Xác nhận trả"
  const handleReturnItem = async (itemId: string) => {
    if (!confirm("Xác nhận thiết bị đã được trả lại kho?")) return;
    try {
      // Gọi API cập nhật status -> available
      await equipmentService.updateEquipmentItem(itemId, {
        status: "available",
      });

      // Reload dữ liệu để cập nhật UI
      await fetchData();
      alert("Đã cập nhật trạng thái thiết bị thành công!");
    } catch (error) {
      console.error("Lỗi khi trả thiết bị:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  // Chỉnh sửa
  const handleEditDevice = (device: Device) => {
    setEditingDevice(device);
    setIsEditModalOpen(true);
  };

  // Lưu thông tin Chỉnh sửa
  const handleSaveDevice = async (id: string, data: Partial<Equipment>) => {
    try {
      await equipmentService.updateEquipment(id, data);
      await fetchData();
    } catch (error) {
      console.error("Lỗi khi lưu thiết bị:", error);
      alert("Không thể lưu thay đổi.");
    }
  };

  const rentedItems = equipmentItems.filter((i) => i.status === "rented");
  const maintenanceItems = equipmentItems.filter(
    (i) => i.status === "maintenance" || i.status === "broken",
  );

  // Logic Cảnh báo & Thống kê
  const lowStock = devices
    .filter((d) => d.total !== undefined && d.total < 5)
    .map((d) => ({ name: d.name, remaining: d.total || 0 }));
  const maintenanceSummary = Object.values(
    maintenanceItems.reduce(
      (acc, item) => {
        const eqName =
          typeof item.equipment === "object"
            ? item.equipment.name
            : "Thiết bị #" + item.equipment;
        if (!acc[eqName]) acc[eqName] = { name: eqName, issue: 0 };
        acc[eqName].issue += 1;
        return acc;
      },
      {} as Record<string, { name: string; issue: number }>,
    ),
  ).slice(0, 3);

  const stats = [
    {
      id: 1,
      title: "Loại dụng cụ",
      value: devices.length.toString(),
      color: "text-blue-600",
      icon: <Package className="h-5 w-5 text-blue-600" />,
    },
    {
      id: 2,
      title: "Tổng số lượng",
      value: equipmentItems.length.toString(),
      color: "text-indigo-600",
      icon: <CheckCircle2 className="h-5 w-5 text-indigo-600" />,
    },
    {
      id: 3,
      title: "Đang cho mượn",
      value: rentedItems.length.toString(),
      color: "text-yellow-600",
      icon: <Package className="h-5 w-5 text-yellow-600" />,
    },
    {
      id: 4,
      title: "Hỏng / Bảo trì",
      value: maintenanceItems.length.toString(),
      color: "text-red-600",
      icon: <Wrench className="h-5 w-5 text-red-600" />,
    },
  ];

  return (
    <div className="flex flex-col gap-8 pt-4">
      <PageHeader
        title="Quản lý dụng cụ"
        subtitle="Theo dõi và quản lý dụng cụ thể thao trong sân"
      />

      {/* Chỉnh Sửa */}
      <EditDeviceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        device={editingDevice}
        onSave={handleSaveDevice}
      />

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <>
          {/* Stats & Warnings */}
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

          {(lowStock.length > 0 || maintenanceSummary.length > 0) && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {lowStock.length > 0 && (
                <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-5 shadow-sm">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-yellow-700">
                    <AlertTriangle className="h-5 w-5" /> Cảnh báo kho ít
                  </h3>
                  {lowStock.map((it, idx) => (
                    <div
                      key={idx}
                      className="mb-1 flex justify-between text-sm text-gray-700"
                    >
                      <span>{it.name}</span>
                      <span className="rounded-md bg-yellow-100 px-2 py-0.5 font-medium text-yellow-700">
                        {it.remaining} còn lại
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            {[
              { id: "stock", label: "Kho hàng", count: devices.length },
              { id: "loan", label: "Cho mượn", count: rentedItems.length },
              { id: "maint", label: "Bảo trì", count: maintenanceItems.length },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as "stock" | "loan" | "maint")}
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

          {/* TAB: STOCK */}
          {tab === "stock" && (
            <div>
              {devices.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-gray-500">
                  Không có dụng cụ nào trong kho
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {devices.map((d, idx) => (
                    <DeviceCard
                      key={d._id}
                      d={d}
                      onEdit={handleEditDevice}
                      onRefresh={fetchData} // Nút Cập nhật sẽ reload data
                      data={data}
                      index={idx}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: LOAN */}
          {tab === "loan" && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-lg font-semibold text-gray-800">
                Danh sách cho mượn
              </h2>
              <div className="mt-4 space-y-3">
                {rentedItems.length === 0 ? (
                  <p className="py-8 text-center text-gray-500 italic">
                    Hiện không có thiết bị nào đang được mượn.
                  </p>
                ) : (
                  rentedItems.map((item) => {
                    const eqName =
                      typeof item.equipment === "object"
                        ? item.equipment.name
                        : "Thiết bị chưa xác định";
                    return (
                      <div
                        key={item._id}
                        className="flex flex-col justify-between gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50 sm:flex-row sm:items-center"
                      >
                        <div>
                          <p className="flex items-center gap-2 font-medium text-gray-800">
                            {eqName}
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                              Đang mượn
                            </span>
                          </p>
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Hash className="h-3 w-3" />{" "}
                              {item.serialNumber || "No Serial"}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarClock className="h-3 w-3" />{" "}
                              {item.updatedAt
                                ? new Date(item.updatedAt).toLocaleDateString(
                                    "vi-VN",
                                  )
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleReturnItem(item._id)}
                          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm whitespace-nowrap text-white shadow-sm hover:bg-blue-700"
                        >
                          Xác nhận trả
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB: MAINT (Giữ nguyên) */}
          {tab === "maint" && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-1 text-lg font-semibold text-gray-800">
                Lịch bảo trì / Hỏng hóc
              </h2>
              <div className="mt-4 space-y-3">
                {maintenanceItems.length === 0 ? (
                  <p className="py-4 text-center text-gray-500">
                    Tốt! Không có thiết bị hỏng.
                  </p>
                ) : (
                  maintenanceItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">
                          {(item.equipment as Equipment).name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.status === "maintenance"
                            ? "Đang bảo trì"
                            : "Đã hỏng"}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-red-500">
                        Cần xử lý
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DevicesManagement;
