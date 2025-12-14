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

const BookingHistory = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [rentals, setRentals] = useState<EquipmentRental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user._id) {
          const data = await equipmentRentalService.getUserRentals(user._id);
          setRentals(data);
        }
      } catch (error) {
        console.error("Failed to fetch rentals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  // Mock data - dữ liệu mẫu
  const mockBookings = [
    {
      id: 1,
      type: "booking",
      name: "Sân Tennis A1",
      date: "2024-11-15",
      time: "14:00 - 15:00",
      price: 180000,
      status: "Đã duyệt",
      statusColor: "green",
    },
    {
      id: 2,
      type: "equipment",
      name: "Vợt cầu lông + Quả cầu",
      date: "2024-11-10",
      time: "10:00 - 12:00",
      price: 17000,
      status: "Đã thanh toán",
      statusColor: "blue",
    },
    {
      id: 3,
      type: "booking",
      name: "Sân Futsal B2",
      date: "2024-10-28",
      time: "18:00 - 19:00",
      price: 200000,
      status: "Hoàn thành",
      statusColor: "gray",
    },
    {
      id: 4,
      type: "booking",
      name: "Sân Bóng rổ C1",
      date: "2024-10-20",
      time: "16:00 - 17:00",
      price: 150000,
      status: "Đã hủy",
      statusColor: "red",
    },
  ];

  const rentalBookings = rentals.map((rental) => ({
    id: rental._id,
    type: "equipment-rental",
    name: `Thuê thiết bị - ${rental.equipmentId}`, // Would need equipment name
    date: rental.rentalDate,
    time: `${rental.duration} giờ`,
    price: rental.totalPrice,
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
  }));

  const bookings = [...mockBookings, ...rentalBookings];

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

  const filteredBookings = bookings.filter(
    (booking) =>
      (filterStatus === "Tất cả" || booking.status === filterStatus) &&
      (booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.date.includes(searchTerm)),
  );

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
          Sắp tới (0)
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 pb-3 font-medium transition ${
            activeTab === "history"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Lịch sử (0)
        </button>
      </div>

      {/* Search & Filter */}
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

      {/* Content */}
      {activeTab === "upcoming" ? (
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-300" />
          <p className="text-lg text-gray-600">Không có booking nào</p>
          <p className="mt-2 text-sm text-gray-500">
            Bạn chưa có lịch đặt sân hoặc thuê thiết bị nào sắp tới
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
              <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <p className="text-lg text-gray-600">Không tìm thấy kết quả</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
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
                    <button className="rounded-md border px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50">
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
