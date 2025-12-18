import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  History,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";
import PageHeader from "@/components/Admin/PageHeader";
import bookingService, { type CourtBooking } from "@/services/bookingService";

interface BookingDisplay {
  id: string;
  shortId: string;
  facilityName: string;
  facilityLocation: string;
  date: string;
  timeSlot: string;
  price: number;
  status: string;
  statusColor: string;
  paymentStatus: string;
  rawStatus: string;
  checkinTime?: string;
  checkoutTime?: string;
  createdAt: string;
}

const CourtBookingHistory = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [bookings, setBookings] = useState<CourtBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingDisplay | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const statusOptions = ["Tất cả", "Đã xác nhận", "Chờ thanh toán", "Hoàn thành", "Đã hủy"];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await bookingService.getMyBookings();
        setBookings(data);
      } catch (error: any) {
        console.error("Failed to fetch bookings:", error);
        setError(error.response?.data?.message || "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Transform data
  const displayBookings: BookingDisplay[] = bookings.map((booking) => {
    // Format date
    const bookingDate = new Date(booking.date);
    const formattedDate = bookingDate.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Status mapping
    let statusText = "";
    let statusColor = "gray";

    switch (booking.status) {
      case "confirmed":
        statusText = "Đã xác nhận";
        statusColor = "green";
        break;
      case "pending":
        statusText = "Chờ thanh toán";
        statusColor = "blue";
        break;
      case "completed":
        statusText = "Hoàn thành";
        statusColor = "gray";
        break;
      case "cancelled":
        statusText = "Đã hủy";
        statusColor = "red";
        break;
      case "no_show":
        statusText = "Không đến";
        statusColor = "red";
        break;
      default:
        statusText = booking.status;
    }

    return {
      id: booking._id,
      shortId: booking._id.slice(-6).toUpperCase(),
      facilityName: booking.facilityName || "Sân thể thao đa năng",
      facilityLocation: booking.facilityLocation || "Khu A - ĐHBK",
      date: formattedDate,
      timeSlot: booking.timeSlot,
      price: booking.price,
      status: statusText,
      statusColor,
      paymentStatus: booking.paymentStatus,
      rawStatus: booking.status,
      checkinTime: booking.checkinTime,
      checkoutTime: booking.checkoutTime,
      createdAt: booking.createdAt || "",
    };
  });

  // Filter by tab
  const upcomingBookings = displayBookings.filter(
    (b) => b.rawStatus === "confirmed" || b.rawStatus === "pending"
  );
  const historyBookings = displayBookings.filter(
    (b) =>
      b.rawStatus === "completed" ||
      b.rawStatus === "cancelled" ||
      b.rawStatus === "no_show"
  );

  const currentList = activeTab === "upcoming" ? upcomingBookings : historyBookings;

  // Apply filters
  const filteredBookings = currentList.filter((booking) => {
    const matchesSearch =
      booking.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.shortId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "Tất cả" || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColorClass = (statusColor: string) => {
    const colors = {
      green: "bg-green-50 text-green-700 border-green-200",
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      red: "bg-red-50 text-red-700 border-red-200",
      gray: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colors[statusColor as keyof typeof colors] || colors.gray;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return <CheckCircle2 className="h-4 w-4" />;
      case "Đã xác nhận":
        return <CheckCircle2 className="h-4 w-4" />;
      case "Chờ thanh toán":
        return <Clock className="h-4 w-4" />;
      case "Đã hủy":
      case "Không đến":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Bạn có chắc muốn hủy đặt sân này?")) return;

    try {
      setCancellingId(id);
      await bookingService.cancelBooking(id);
      
      // Refresh data
      const data = await bookingService.getMyBookings();
      setBookings(data);
      setSelectedBooking(null);
      alert("Hủy đặt sân thành công!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Không thể hủy đặt sân");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pt-4">
      <PageHeader
        title="Lịch sử đặt sân"
        subtitle="Quản lý và theo dõi các đơn đặt sân thể thao"
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

      {/* FILTER BAR */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sân hoặc mã đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border bg-white py-2 pl-9 pr-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {error ? (
          <div className="flex flex-col items-center rounded-xl border bg-white p-12 text-center shadow-sm">
            <AlertCircle className="mb-4 h-12 w-12 text-red-400" />
            <p className="text-lg font-medium text-gray-900">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Tải lại
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
            <History className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">
              {searchTerm || filterStatus !== "Tất cả"
                ? "Không tìm thấy kết quả phù hợp"
                : activeTab === "upcoming"
                  ? "Bạn chưa có đơn đặt sân nào sắp tới"
                  : "Bạn chưa có lịch sử đặt sân"}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {activeTab === "upcoming"
                ? "Hãy đến trang đặt sân để bắt đầu!"
                : "Các đơn đã hoàn thành sẽ hiển thị tại đây"}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md md:flex-row md:items-center md:justify-between"
            >
              {/* Left: Info */}
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {booking.facilityName}
                    </h3>
                    <span className="text-xs text-gray-400">#{booking.shortId}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {booking.facilityLocation}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {booking.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {booking.timeSlot}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Status & Actions */}
              <div className="flex flex-col items-end gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-blue-600">
                    {booking.price.toLocaleString("vi-VN")} đ
                  </span>
                  <span
                    className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColorClass(booking.statusColor)}`}
                  >
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  {booking.rawStatus === "pending" && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={cancellingId === booking.id}
                      className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {cancellingId === booking.id ? "Đang hủy..." : "Hủy đặt"}
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Chi tiết đặt sân{" "}
                <span className="text-base font-normal text-gray-400">
                  #{selectedBooking.shortId}
                </span>
              </h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6 p-6">
              {/* Facility Info */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <MapPin className="h-4 w-4 text-blue-500" /> Thông tin sân
                </h3>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="font-semibold text-gray-900">
                    {selectedBooking.facilityName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedBooking.facilityLocation}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Trạng thái
                  </p>
                  <span
                    className={`mt-1 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColorClass(selectedBooking.statusColor)}`}
                  >
                    {getStatusIcon(selectedBooking.status)}
                    {selectedBooking.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Thanh toán
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full border px-3 py-1 text-xs font-medium ${
                      selectedBooking.paymentStatus === "paid"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-yellow-200 bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {selectedBooking.paymentStatus === "paid"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </span>
                </div>
              </div>

              {/* Time Info */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Info className="h-4 w-4 text-blue-500" /> Thông tin đặt sân
                </h3>
                <div className="space-y-2 rounded-lg bg-gray-50 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Ngày đặt</span>
                    <span className="font-medium text-gray-900">
                      {selectedBooking.date}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Khung giờ</span>
                    <span className="font-medium text-gray-900">
                      {selectedBooking.timeSlot}
                    </span>
                  </div>
                  {selectedBooking.checkinTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Check-in</span>
                      <span className="font-medium text-gray-900">
                        {new Date(selectedBooking.checkinTime).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  )}
                  {selectedBooking.checkoutTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Check-out</span>
                      <span className="font-medium text-gray-900">
                        {new Date(selectedBooking.checkoutTime).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t pt-3 mt-3">
                    <span className="font-bold text-gray-900">Tổng thanh toán</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {selectedBooking.price.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t bg-gray-50 p-4">
              {selectedBooking.rawStatus === "pending" && (
                <button
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                  disabled={cancellingId === selectedBooking.id}
                  className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-50"
                >
                  {cancellingId === selectedBooking.id ? "Đang hủy..." : "Hủy đặt sân"}
                </button>
              )}
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
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

export default CourtBookingHistory;
