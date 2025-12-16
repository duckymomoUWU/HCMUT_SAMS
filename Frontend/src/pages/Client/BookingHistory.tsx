import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import PageHeader from "@/components/Admin/PageHeader";
import equipmentRentalService, {
  type EquipmentRental,
} from "@/services/equipmentRentalService";
import equipmentService, { type Equipment } from "@/services/equipmentService";
import { decodeJWT } from "@/utils/jwt";

const BookingHistory = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("history");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [rentals, setRentals] = useState<EquipmentRental[]>([]);
  const [equipmentMap, setEquipmentMap] = useState<{
    [key: string]: Equipment;
  }>({});
  const [loading, setLoading] = useState(true);
  const [selectedRental, setSelectedRental] = useState<any>(null);
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        // Get userId
        const token = localStorage.getItem("accessToken");
        let userId: string | null = null;

        if (token) {
          try {
            const decoded = decodeJWT(token);
            userId = decoded.sub || decoded.id || decoded._id;
            console.log("User ID from token:", userId);
          } catch (e) {
            console.error("Failed to decode token:", e);
          }
        }

        if (!userId) {
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          userId = user._id;
          console.log("User ID from localStorage:", userId);
        }

        if (userId) {
          console.log("Fetching rentals for user:", userId);
          const data = await equipmentRentalService.getUserRentals(userId);
          console.log("Fetched rentals:", data);
          setRentals(data);
          // Fetch all equipment
          try {
            const allEquipment = await equipmentService.getEquipments();
            const map: { [key: string]: Equipment } = {};
            allEquipment.forEach((eq) => {
              map[eq._id] = eq;
            });
            setEquipmentMap(map);
            console.log("Equipment map:", map);
          } catch (error) {
            console.error("Failed to fetch equipment:", error);
          }
        } else {
          console.error("No user ID found");
        }
      } catch (error) {
        console.error("Failed to fetch rentals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  const rentalBookings = rentals.map((rental) => {
    // Handle populated equipmentId - it can be string or object
    let equipmentName = "Thiết bị";
    let equipment: any = null;
    
    if (typeof rental.equipmentId === "object" && rental.equipmentId !== null) {
      // equipmentId is populated object
      equipment = rental.equipmentId;
      equipmentName = equipment.name || "Thiết bị";
    } else if (typeof rental.equipmentId === "string") {
      // equipmentId is just a string ID, look up in equipmentMap
      equipment = equipmentMap[rental.equipmentId];
      if (equipment && typeof equipment === "object" && "name" in equipment) {
        equipmentName = (equipment as any).name;
      }
    }

    // Format date - properly parse ISO date
    const dateStr =
      typeof rental.rentalDate === "string"
        ? rental.rentalDate.split("T")[0]
        : rental.rentalDate;
    const rentalDateTime = new Date(dateStr + "T00:00:00");
    const formattedDate = rentalDateTime.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // Calculate time range based on duration (2-hour slots)
    const startHour = 8;
    const endHour = startHour + rental.duration;
    const timeRange = `${String(startHour).padStart(2, "0")}:00 - ${String(endHour).padStart(2, "0")}:00`;

    return {
      id: rental._id,
      type: "equipment-rental",
      name: `Thuê thiết bị - ${equipmentName}`,
      equipmentName,
      date: formattedDate,
      rawDate: dateStr,
      time: timeRange,
      price: rental.totalPrice,
      quantity: rental.quantity,
      duration: rental.duration,
      status:
        rental.status === "renting"
          ? "Đang thuê"
          : rental.status === "completed"
            ? "Đã trả"
            : "Quá hạn",
      statusColor:
        rental.status === "renting"
          ? "blue"
          : rental.status === "completed"
            ? "green"
            : "red",
      rentalStatus: rental.status,
      equipment,
      rental,
    };
  });

  // Separate upcoming and history bookings
  const today = new Date().toISOString().split("T")[0];
  const upcomingBookings = rentalBookings.filter(
    (booking) => booking.rawDate && booking.rawDate >= today && booking.rentalStatus === "renting",
  );
  // Only show real rental data, no mock data
  const historyBookings = rentalBookings.filter(
    (booking) => booking.rentalStatus !== "renting" || (booking.rawDate && booking.rawDate < today),
  );

  const filteredBookings =
    activeTab === "upcoming" ? upcomingBookings : historyBookings;

  const filteredByStatus = filteredBookings.filter(
    (booking) =>
      (filterStatus === "Tất cả" || booking.status === filterStatus) &&
      (booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.date.includes(searchTerm)),
  );

  console.log("Bookings:", {
    upcoming: upcomingBookings,
    history: historyBookings,
  });

  const statusOptions = [
    "Tất cả",
    "Chờ duyệt",
    "Đã duyệt",
    "Chờ thanh toán",
    "Đã thanh toán",
    "Đã check-in",
    "Hoàn thành",
    "Đã hủy",
    "Hết hạn",
    "Đang thuê",
    "Đã trả",
    "Quá hạn",
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Đã duyệt":
      case "Đã thanh toán":
      case "Đã trả":
        return <CheckCircle2 className="h-4 w-4" />;
      case "Chờ duyệt":
      case "Chờ thanh toán":
      case "Đang thuê":
        return <Clock className="h-4 w-4" />;
      case "Đã hủy":
      case "Hết hạn":
      case "Quá hạn":
        return <XCircle className="h-4 w-4" />;
      case "Hoàn thành":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColorClass = (statusColor: string) => {
    const colors = {
      green: "bg-green-50 text-green-700 border-green-200",
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
      red: "bg-red-50 text-red-700 border-red-200",
      gray: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colors[statusColor as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="flex flex-col gap-8 pt-4">
      <PageHeader
        title="Lịch sử đặt chỗ"
        subtitle="Quản lý và theo dõi tất cả đơn đặt sân và thuê thiết bị"
      />

      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 pb-3 font-medium transition ${
            activeTab === "upcoming"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Sắp tới ({upcomingBookings.length})
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

      {/* Tìm kiếm và bộ lọc */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã booking hoặc thiết bị..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border bg-white py-2 pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

      {/* Xem lịch sử thuê và lịch thuê sắp tới */}
      <div className="space-y-4">
        {filteredByStatus.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
            <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <p className="text-lg text-gray-600">Không có booking nào</p>
            <p className="mt-2 text-sm text-gray-500">
              {activeTab === "upcoming"
                ? "Bạn chưa có lịch đặt sân hoặc thuê thiết bị nào sắp tới"
                : "Bạn chưa có lịch sử đặt sân hoặc thuê thiết bị nào"}
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
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.name}
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

                  <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">
                        {booking.price.toLocaleString("vi-VN")} đ
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {booking.status === "Đã duyệt" && (
                    <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                      Thanh toán
                    </button>
                  )}
                  {booking.status === "Hoàn thành" && (
                    <button className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50">
                      <RefreshCw className="h-4 w-4" />
                      Đặt lại
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedRental(booking)}
                    className="rounded-md border px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Xem chi tiết lượt thuê */}
      {selectedRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Chi tiết đơn thuê
              </h2>
              <button
                onClick={() => setSelectedRental(null)}
                className="text-gray-500 transition hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-4 font-semibold text-gray-900">
                  Thông tin cơ bản
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Thiết bị</p>
                    <p className="font-medium text-gray-900">
                      {selectedRental.equipmentName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trạng thái</p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColorClass(
                        selectedRental.statusColor,
                      )}`}
                    >
                      {getStatusIcon(selectedRental.status)}
                      {selectedRental.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số lượng</p>
                    <p className="font-medium text-gray-900">
                      {selectedRental.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Thời lượng thuê</p>
                    <p className="font-medium text-gray-900">
                      {selectedRental.duration} giờ
                    </p>
                  </div>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-4 font-semibold text-gray-900">Lịch thuê</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Ngày thuê</p>
                    <p className="font-medium text-gray-900">
                      {selectedRental.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Thời gian</p>
                    <p className="font-medium text-gray-900">
                      {selectedRental.time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Equipment Details */}
              {selectedRental.equipment && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-4 font-semibold text-gray-900">
                    Chi tiết thiết bị
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-600">Loại thiết bị</p>
                      <p className="font-medium text-gray-900">
                        {(selectedRental.equipment as any).type || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Giá/giờ</p>
                      <p className="font-medium text-gray-900">
                        {(
                          (selectedRental.equipment as any).pricePerHour || 0
                        ).toLocaleString("vi-VN")}{" "}
                        đ
                      </p>
                    </div>
                  </div>
                  {(selectedRental.equipment as any).description && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Mô tả</p>
                      <p className="text-gray-900">
                        {(selectedRental.equipment as any).description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Price Info */}
              <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                <h3 className="mb-4 font-semibold text-gray-900">Tổng cộng</h3>
                <div className="flex items-baseline justify-between">
                  <span className="text-gray-600">Thành tiền:</span>
                  <span className="text-3xl font-bold text-blue-600">
                    {(selectedRental.price || 0).toLocaleString("vi-VN")} đ
                  </span>
                </div>
              </div>

              {/* Rental ID */}
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600">Mã đơn thuê</p>
                <p className="font-mono text-sm font-medium text-gray-900">
                  {selectedRental.id}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedRental(null)}
                  className="flex-1 rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-900 transition hover:bg-gray-300"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
