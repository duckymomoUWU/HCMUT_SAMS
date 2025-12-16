import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Package,
  History,
  AlertCircle,
  Info,
  Hash,
} from "lucide-react";
import PageHeader from "@/components/Admin/PageHeader";
import equipmentRentalService, {
  type EquipmentRental,
} from "@/services/equipmentRentalService";
import equipmentService, { type Equipment } from "@/services/equipmentService";
import { decodeJWT } from "@/utils/jwt";

interface PopulatedEquipmentRental
  extends Omit<EquipmentRental, "equipmentId"> {
  equipmentId: string | Equipment;
  items?: Array<{
    _id: string;
    status: string;
    serialNumber?: string;
  }>;
  createdAt?: string;
}

const BookingHistory = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [rentals, setRentals] = useState<PopulatedEquipmentRental[]>([]);
  const [equipmentMap, setEquipmentMap] = useState<{
    [key: string]: Equipment;
  }>({});
  const [loading, setLoading] = useState(true);
  const [selectedRental, setSelectedRental] = useState<any>(null);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        let userId: string | null = null;

        if (token) {
          try {
            const decoded = decodeJWT(token);
            userId = decoded.sub || decoded.id || decoded._id;
          } catch (e) {
            console.error(e);
          }
        }

        if (!userId) {
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          userId = user._id;
        }

        if (userId) {
          const data = await equipmentRentalService.getUserRentals(userId);

          // SẮP XẾP: Đưa đơn mới nhất lên đầu
          const sortedData = data.sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
          });

          setRentals(sortedData as unknown as PopulatedEquipmentRental[]);

          const allEquipment = await equipmentService.getEquipments();
          const map: { [key: string]: Equipment } = {};
          allEquipment.forEach((eq) => {
            map[eq._id] = eq;
          });
          setEquipmentMap(map);
        }
      } catch (error) {
        console.error("Failed to fetch rentals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  // --- XỬ LÝ DỮ LIỆU ---
  const rentalBookings = rentals.map((rental) => {
    let equipment: Equipment | undefined;
    if (typeof rental.equipmentId === "object" && rental.equipmentId !== null) {
      equipment = rental.equipmentId as unknown as Equipment;
    } else {
      equipment = equipmentMap[rental.equipmentId as string];
    }
    const equipmentName = equipment
      ? equipment.name
      : "Thiết bị không xác định";

    const dateStr =
      typeof rental.rentalDate === "string"
        ? rental.rentalDate.split("T")[0]
        : new Date(rental.rentalDate).toISOString().split("T")[0];

    const rentalDateTime = new Date(rental.rentalDate);
    const formattedDate = rentalDateTime.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const startHour = 8;
    const endHour = startHour + rental.duration;
    const timeRange = `${String(startHour).padStart(2, "0")}:00 - ${String(endHour).padStart(2, "0")}:00`;

    const areItemsReturned =
      rental.items &&
      rental.items.length > 0 &&
      rental.items.every((item) => item.status === "available");

    let finalStatus = rental.status;
    if (finalStatus === "renting" && areItemsReturned) {
      finalStatus = "completed";
    }

    let statusText = "Chờ xử lý";
    let statusColor = "gray";

    switch (finalStatus) {
      case "renting":
        statusText = "Đang thuê";
        statusColor = "blue";
        break;
      case "completed":
        statusText = "Đã trả";
        statusColor = "green";
        break;
      case "cancelled":
        statusText = "Đã hủy";
        statusColor = "red";
        break;
      default:
        statusText = finalStatus;
    }

    return {
      id: rental._id,
      shortId: rental._id.slice(-6).toUpperCase(),
      type: "equipment-rental",
      name: `Thuê: ${equipmentName}`,
      equipmentName,
      date: formattedDate,
      rawDate: dateStr,
      time: timeRange,
      totalPrice: rental.totalPrice,
      quantity: rental.quantity || 1,
      duration: rental.duration,
      status: statusText,
      statusColor: statusColor,
      rentalStatus: finalStatus,
      equipment,
      items: rental.items || [],
    };
  });

  const upcomingBookings = rentalBookings.filter(
    (b) => b.rentalStatus === "renting",
  );
  const historyBookings = rentalBookings.filter(
    (b) => b.rentalStatus === "completed" || b.rentalStatus === "cancelled",
  );
  const filteredBookings =
    activeTab === "upcoming" ? upcomingBookings : historyBookings;

  const filteredByStatus = filteredBookings.filter(
    (booking) =>
      (filterStatus === "Tất cả" || booking.status === filterStatus) &&
      (booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.shortId.includes(searchTerm.toUpperCase())),
  );

  const statusOptions = ["Tất cả", "Đang thuê", "Đã trả", "Đã hủy"];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Đã trả":
        return <CheckCircle2 className="h-4 w-4" />;
      case "Đang thuê":
        return <Clock className="h-4 w-4" />;
      case "Đã hủy":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColorClass = (statusColor: string) => {
    const colors = {
      green: "bg-green-50 text-green-700 border-green-200",
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      red: "bg-red-50 text-red-700 border-red-200",
      gray: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colors[statusColor as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="flex flex-col gap-8 pt-4">
      <PageHeader
        title="Lịch sử thuê đồ"
        subtitle="Quản lý và theo dõi các đơn thuê thiết bị thể thao"
      />

      {/* TABS */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 pb-3 font-medium transition ${
            activeTab === "upcoming"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Đang thuê ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 pb-3 font-medium transition ${
            activeTab === "history"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Lịch sử ({historyBookings.length})
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mã đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border bg-white py-2 pr-3 pl-9 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* MAIN LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-8 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : filteredByStatus.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
            <History className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">
              Không có dữ liệu
            </p>
          </div>
        ) : (
          filteredByStatus.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                      <Package className="h-5 w-5 text-blue-600" />
                      {booking.name}
                      <span className="text-xs font-normal text-gray-400">
                        #{booking.shortId}
                      </span>
                    </h3>
                    <span
                      className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColorClass(
                        booking.statusColor,
                      )}`}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-400" />
                      <span>SL: {booking.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>
                        {booking.time} ({booking.duration}h)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {booking.totalPrice.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRental(booking)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CHI TIẾT */}
      {selectedRental && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 duration-200">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Chi tiết đơn thuê{" "}
                <span className="text-base font-normal text-gray-400">
                  #{selectedRental.shortId}
                </span>
              </h2>
              <button
                onClick={() => setSelectedRental(null)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Thông tin chính */}
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Thiết bị
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {selectedRental.equipmentName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Trạng thái
                  </p>
                  <span
                    className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${getStatusColorClass(selectedRental.statusColor)}`}
                  >
                    {selectedRental.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Số lượng
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {selectedRental.quantity} cái
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Thời lượng
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {selectedRental.duration} giờ
                  </p>
                </div>
              </div>

              {/* Chi tiết items */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Info className="h-4 w-4 text-blue-500" /> Danh sách thiết bị
                  cụ thể
                </h3>
                {selectedRental.items && selectedRental.items.length > 0 ? (
                  <div className="max-h-40 divide-y overflow-y-auto rounded-lg border">
                    {selectedRental.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex justify-between p-3 text-sm"
                      >
                        <span className="text-gray-600">
                          Mã thiết bị #{idx + 1}
                        </span>
                        <span className="font-mono font-medium text-gray-800">
                          {item.serialNumber ||
                            item._id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed bg-gray-50 p-3 text-sm text-gray-500 italic">
                    Chưa có thông tin thiết bị cụ thể (Đang chờ giao đồ)
                  </p>
                )}
              </div>

              {/* Thông tin thời gian & Giá */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ngày thuê</span>
                  <span className="font-medium text-gray-900">
                    {selectedRental.date}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Khung giờ</span>
                  <span className="font-medium text-gray-900">
                    {selectedRental.time}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-bold text-gray-900">
                    Tổng thanh toán
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {selectedRental.totalPrice.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end bg-gray-50 p-4">
              <button
                onClick={() => setSelectedRental(null)}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
