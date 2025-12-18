import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "sonner";
import {
  Search,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import PageHeader from "@/components/Admin/PageHeader";
import api from "@/services/api";

interface Booking {
  _id: string;
  facility: {
    name: string;
    location: string;
  };
  bookingDate: string;
  startTime?: string; // Bổ sung
  endTime?: string;   // Bổ sung
  slots: {
    startTime: string;
    endTime: string;
    price: number;
  }[];
  totalPrice: number;
  status: string;
}

const BookingHistory = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [repayLoading, setRepayLoading] = useState<string | null>(null); // To track loading state for each button

  // State for details modal
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState<Booking | null>(null);

  const handleShowDetails = (booking: Booking) => {
    setSelectedBookingForDetails(booking);
    setDetailsModalOpen(true);
  };

  const handleRepay = async (bookingId: string) => {
    setRepayLoading(bookingId);
    try {
      const response = await api.post(`/booking/${bookingId}/repay`);
      const { paymentUrl } = response.data;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.error("Không thể tạo link thanh toán. Vui lòng thử lại.");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Đã xảy ra lỗi khi tạo lại thanh toán.";
      toast.error(errorMessage);
    } finally {
      setRepayLoading(null);
    }
  };

  const navigate = useNavigate(); // Keep navigate for other potential uses

  useEffect(() => {
    const fetchBookings = async () => {
      // 1. Xử lý Toast thông báo từ VNPay trước
      const params = new URLSearchParams(window.location.search);
      const status = params.get('status');
      if (status === 'cancelled') {
        toast.warning("Bạn đã hủy thanh toán đơn đặt sân.");
        window.history.replaceState({}, '', window.location.pathname);
      } else if (status === 'success') {
        toast.success("Thanh toán thành công!");
        window.history.replaceState({}, '', window.location.pathname);
      }

      // 2. Kiểm tra Token (Dùng accessToken cho đúng với AuthService)
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/booking/history?type=all");
        // 3. Trích xuất mảng dữ liệu
        const data = response.data?.bookings || response.data?.data || response.data || [];
        setBookings(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError("Không thể tải lịch sử đặt chỗ. Vui lòng thử lại.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
      case "CONFIRMED":
      case "CHECKED_IN":
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4" />;
      case "PENDING_PAYMENT":
        return <Clock className="h-4 w-4" />;
      case "CANCELLED":
      case "FAILED":
      case "EXPIRED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "PAID":
      case "CONFIRMED":
      case "CHECKED_IN":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "COMPLETED":
        return "bg-green-50 text-green-700 border-green-200";
      case "PENDING_PAYMENT":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "CANCELLED":
      case "FAILED":
      case "EXPIRED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const statusMapping: { [key: string]: string } = {
    PENDING_PAYMENT: "Chờ thanh toán",
    CONFIRMED: "Đã xác nhận",
    PAID: "Đã thanh toán",
    CANCELLED: "Đã hủy",
    FAILED: "Thất bại",
    CHECKED_IN: "Đã check-in",
    COMPLETED: "Hoàn thành",
    EXPIRED: "Hết hạn thanh toán",
  };

  const statusOptions = ["Tất cả", ...Object.values(statusMapping)];

  const now = new Date();

  const getEarliestStartTime = (booking: Booking): string | null => {
    // Ưu tiên lấy từ startTime trực tiếp (giống dữ liệu DB của bạn)
    if (booking.startTime) return booking.startTime;

    // Nếu không có thì mới tìm trong slots
    if (!booking.slots || booking.slots.length === 0) return null;
    return booking.slots.reduce((earliest, current) =>
      current.startTime < earliest ? current.startTime : earliest
      , "23:59");
  };
  //Added 
  const getBookingDateTime = (booking: Booking) => {
    const earliestStartTime = getEarliestStartTime(booking);
    if (!earliestStartTime) return new Date(0); // Return a very past date if no slots

    const bookingDateObj = new Date(booking.bookingDate);
    const [hours, minutes] = earliestStartTime.split(':').map(Number);
    bookingDateObj.setHours(hours, minutes, 0, 0);
    return bookingDateObj;
  };

  // 1. Lọc toàn bộ đơn Đặt Sân (Phải có facility)
  const facilityBookings = bookings.filter(b => b.facility && b.facility.name);

  // 2. Lọc toàn bộ đơn Thiết bị (Không có facility)
  const equipmentBookings = bookings.filter(b => !b.facility);

  // 3. Logic tìm kiếm cho Tab Đặt Sân
  const filteredFacilities = facilityBookings.filter(b =>
    (filterStatus === "Tất cả" || statusMapping[b.status] === filterStatus) &&
    (b.facility.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 4. Logic tìm kiếm cho Tab Thiết bị
  const filteredEquipments = equipmentBookings.filter(b =>
    (filterStatus === "Tất cả" || statusMapping[b.status] === filterStatus) &&
    ((b.facility?.name || 'Thiết bị').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderBookingCard = (booking: Booking) => {
    if (!booking.slots || booking.slots.length === 0) return null;

    // Get the overall time range
    // 1. Lấy thời gian hiển thị linh hoạt (Ưu tiên startTime/endTime trực tiếp từ DB)
    const startTime = booking.startTime || (booking.slots?.[0]?.startTime);
    const endTime = booking.endTime || (booking.slots?.[booking.slots.length - 1]?.endTime);
    const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : "N/A";

    // 2. Tính số lượng slot (nếu có)
    const slotCount = booking.slots?.length || 1;

    return (
      <div
        key={booking._id}
        className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {booking.facility?.name || "Sân không xác định"}
              </h3>
              <span
                className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${getStatusColorClass(
                  booking.status,
                )}`}
              >
                {getStatusIcon(booking.status)}
                {statusMapping[booking.status] || booking.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{new Date(booking.bookingDate).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{timeRange} ({slotCount} slot{slotCount > 1 ? 's' : ''})</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-900">
                  {booking.totalPrice.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {['PENDING_PAYMENT'].includes(booking.status) && (
              <button
                onClick={() => handleRepay(booking._id)}
                disabled={repayLoading === booking._id}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {repayLoading === booking._id && <Loader2 className="h-4 w-4 animate-spin" />}
                Thanh toán lại
              </button>
            )}
            {booking.status === "COMPLETED" && (
              <button className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50">
                <RefreshCw className="h-4 w-4" />
                Đặt lại
              </button>
            )}
            <button
              onClick={() => handleShowDetails(booking)}
              className="rounded-md border px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="flex flex-col gap-8 pt-4">
      <PageHeader
        title="Lịch sử đặt chỗ"
        subtitle="Quản lý và theo dõi tất cả đơn đặt sân và thuê thiết bị"
      />

      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 pb-3 font-medium transition ${activeTab === "upcoming"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-600 hover:text-gray-900"
            }`}
        >
          Đặt Sân ({facilityBookings.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 pb-3 font-medium transition-all ${activeTab === "history"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
            }`}
        >
          Thiết bị ({equipmentBookings.length})
        </button>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sân..."
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

      {/* Phần hiển thị danh sách */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      ) : (
        <>
          {/* HIỂN THỊ TAB ĐẶT SÂN */}
          {activeTab === "upcoming" && (
            <div className="space-y-4">
              {filteredFacilities.length === 0 ? (
                <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                  <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                  <p className="text-lg text-gray-600">Bạn chưa có đơn đặt sân nào</p>
                </div>
              ) : (
                filteredFacilities.map(renderBookingCard)
              )}
            </div>
          )}

          {/* HIỂN THỊ TAB THIẾT BỊ */}
          {activeTab === "history" && (
            <div className="space-y-4">
              {filteredEquipments.length === 0 ? (
                <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                  <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                  <p className="text-lg text-gray-600">Bạn chưa có đơn thuê thiết bị nào</p>
                </div>
              ) : (
                filteredEquipments.map(renderBookingCard)
              )}
            </div>
          )}
        </>
      )}

      {/* Details Modal */}
      {detailsModalOpen && selectedBookingForDetails && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[400px] p-6 relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Chi tiết đặt sân</h3>
            <p className="text-sm text-gray-500 mb-4">Đây là thông tin chi tiết về lượt đặt sân của bạn.</p>
            <div className="space-y-2 text-sm text-gray-700 border-t border-b py-4">
              <p className="flex justify-between"><span className="font-medium text-gray-500">Tên sân:</span> <span>{selectedBookingForDetails.facility?.name || 'N/A'}</span></p>
              <p className="flex justify-between"><span className="font-medium text-gray-500">Địa điểm:</span> <span>{selectedBookingForDetails.facility?.location || 'N/A'}</span></p>
              <p className="flex justify-between"><span className="font-medium text-gray-500">Ngày đặt:</span> <span>{new Date(selectedBookingForDetails.bookingDate).toLocaleDateString("vi-VN")}</span></p>
              <div className="flex flex-col">
                <p className="font-medium text-gray-500">Khung giờ đã đặt:</p>
                <ul className="list-disc list-inside pl-4 mt-1">
                  {selectedBookingForDetails.slots && selectedBookingForDetails.slots.length > 0 ? (
                    selectedBookingForDetails.slots
                      .slice() // Tạo bản sao để không làm thay đổi mảng gốc
                      .sort((a, b) => a.startTime.localeCompare(b.startTime)) // Sắp xếp 18:00 trước 19:00
                      .map(slot => (
                        <li key={slot.startTime}>
                          {slot.startTime} - {slot.endTime}
                        </li>
                      ))
                  ) : (
                    <li>
                      {selectedBookingForDetails.startTime} - {selectedBookingForDetails.endTime}
                    </li>
                  )}
                </ul>
              </div>
              <p className="flex justify-between"><span className="font-medium text-gray-500">Trạng thái:</span> <span className="font-medium text-blue-600">{statusMapping[selectedBookingForDetails.status] || selectedBookingForDetails.status}</span></p>
              <p className="flex justify-between"><span className="font-medium text-gray-500">Tổng tiền:</span> <span className="font-bold text-gray-900">{selectedBookingForDetails.totalPrice.toLocaleString("vi-VN")} đ</span></p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setDetailsModalOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">
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
