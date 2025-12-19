// Frontend/src/pages/Admin/OrdersManagement.tsx
import { useState, useEffect } from "react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PageHeader from "@/components/Admin/PageHeader";
import {
  Calendar,
  Clock,
  FileText,
  Search,
  Package,
  Wallet2,
  User,
  Eye,
  Ban,
  Footprints,
  Loader2,
  CheckCircle,
  XCircle,
  LogIn,
} from "lucide-react";
import StatCard from "@/components/Admin/StatCard";
import bookingService, { type CourtBooking } from "@/services/bookingService";
import equipmentRentalService from "@/services/equipmentRentalService";


interface Booking extends CourtBooking {
  // userId is now populated with user object
  type: 'booking';
}

interface Rental {
  _id: string;
  userId: { _id: string; fullName: string; email: string } | string;
  equipmentId: {
    _id: string;
    name: string;
    type: string;
    imageUrl: string;
    pricePerHour: number;
  };
  items: string[];
  rentalDate: string;
  duration: number;
  totalPrice: number;
  status: "renting" | "completed" | "cancelled";
  paymentId?: string;
  type: "rental";
}


type Order = Booking | Rental;

const OrdersManagement = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tất cả");
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch stats
        const statsData = await bookingService.getBookingStats();
        setStats(statsData || { totalBookings: 0, confirmedBookings: 0, pendingBookings: 0, totalRevenue: 0 });


        // Fetch bookings
        const bookingsData = await bookingService.getAdminBookings();
        // const bookings: Booking[] = (bookingsData || []).map(b => ({ ...b, type: 'booking' as const }));

        // SỬA THÀNH: Kiểm tra nếu bookingsData là object chứa mảng bookings
        const bookingsRaw = Array.isArray(bookingsData)
          ? bookingsData
          : (bookingsData as any)?.bookings || [];
        const bookings: Booking[] = bookingsRaw.map((b: CourtBooking) => ({
          ...b,
          type: 'booking' as const
        }));        // Fetch rentals
        const rentalsData = await equipmentRentalService.getAdminRentals();
        const rentals: Rental[] = (rentalsData || []).map(r => ({ ...r, type: 'rental' as const }));

        // Combine orders
        const allOrders: Order[] = [...bookings, ...rentals];
        setOrders(allOrders);
      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshOrders = async () => {
    console.log("📘 [Orders] Fetching bookings...");

    const bookingsData = await bookingService.getAdminBookings();
    const bookings: Booking[] = (bookingsData || []).map(b => ({ ...b, type: 'booking' as const }));
    console.log(
      "📘 [Orders] bookingsData:",
      bookingsData,
      "isArray:",
      Array.isArray(bookingsData)
    );
    // ===== RENTALS =====
    console.log("📙 [Orders] Fetching rentals...");
    const rentalsData = await equipmentRentalService.getAdminRentals();
    console.log(
      "📙 [Orders] rentalsData:",
      rentalsData,
      "isArray:",
      Array.isArray(rentalsData)
    );
    const rentals: Rental[] = (rentalsData || []).map(r => ({ ...r, type: 'rental' as const }));

    const allOrders: Order[] = [...bookings, ...rentals];
    setOrders(allOrders);
  };

  const handleConfirmBooking = async (id: string) => {
    try {
      await bookingService.adminUpdateBooking(id, { status: 'confirmed' });
      await refreshOrders();
    } catch (err: any) {
      console.error('Failed to confirm booking:', err);
      setError(err.response?.data?.message || 'Failed to confirm booking');
    }
  };

  const handleCancelBooking = async (id: string) => {
    const reason = prompt('Lý do hủy (tùy chọn):');
    try {
      await bookingService.adminCancelBooking(id, reason || undefined);
      await refreshOrders();
    } catch (err: any) {
      console.error('Failed to cancel booking:', err);
      setError(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleCheckinBooking = async (id: string) => {
    try {
      await bookingService.adminCheckinBooking(id);
      await refreshOrders();
    } catch (err: any) {
      console.error('Failed to check-in booking:', err);
      setError(err.response?.data?.message || 'Failed to check-in booking');
    }
  };

  const handleCancelRental = async (id: string) => {
    const reason = prompt('Lý do hủy (tùy chọn):');
    try {
      await equipmentRentalService.adminUpdateRentalStatus(id, 'cancelled');
      await refreshOrders();
    } catch (err: any) {
      console.error('Failed to cancel rental:', err);
      setError(err.response?.data?.message || 'Failed to cancel rental');
    }
  };

  // OrdersManagement.tsx

  const calculateIntegratedStats = () => {
    // 1. Tổng đơn: Cộng cả hai loại đơn
    const total = orders.length;

    // 2. Đã xác nhận: 'confirmed' (sân) + 'renting' (thiết bị) + 'completed' (cả hai)
    const confirmed = orders.filter(o =>
      ["confirmed", "completed", "renting"].includes(o.status)
    ).length;

    // 3. Chờ thanh toán: Đơn sân có paymentStatus là 'unpaid' hoặc đơn đang 'pending'
    const pending = orders.filter(o =>
      o.status === "pending" || (o.type === 'booking' && o.paymentStatus === 'unpaid')
    ).length;

    // 4. Doanh thu: Tổng price (sân) + totalPrice (thiết bị) của các đơn đã thanh toán/hoàn thành
    const revenue = orders.reduce((acc, o) => {
      const isPaid = o.type === 'booking'
        ? o.paymentStatus === 'paid'
        : o.status === 'completed'; // Đơn thiết bị tính doanh thu khi đã hoàn thành trả đồ

      if (isPaid) {
        const amount = o.type === 'booking' ? o.price : o.totalPrice;
        return acc + amount;
      }
      return acc;
    }, 0);

    return { total, confirmed, pending, revenue };
  };

  const finalStats = calculateIntegratedStats();

  const statsCards = [
    {
      id: 1,
      title: "Tổng đơn đặt",
      value: finalStats.total.toString(), // Tổng sân + thiết bị
      color: "text-blue-600",
      icon: (
        <div className="p-2 bg-blue-50 rounded-lg">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
      ),
    },
    {
      id: 2,
      title: "Đã xác nhận",
      value: finalStats.confirmed.toString(),
      color: "text-green-600",
      icon: (
        <div className="p-2 bg-green-50 rounded-lg">
          <Package className="w-5 h-5 text-green-600" />
        </div>
      ),
    },
    {
      id: 3,
      title: "Chờ thanh toán",
      value: finalStats.pending.toString(),
      color: "text-yellow-600",
      icon: (
        <div className="p-2 bg-yellow-50 rounded-lg">
          <Wallet2 className="w-5 h-5 text-yellow-600" />
        </div>
      ),
    },
    {
      id: 4,
      title: "Doanh thu",
      value: `${finalStats.revenue.toLocaleString('vi-VN')}đ`,
      color: "text-indigo-600",
      icon: (
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Wallet2 className="w-5 h-5 text-indigo-600" />
        </div>
      ),
    },
  ];
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString('vi-VN');

    // 1. Tiêu đề báo cáo
    doc.setFontSize(20);
    doc.text("BAO CAO HE THONG QUAN LY SAMS", 105, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Ngay xuat: ${today}`, 105, 22, { align: 'center' });

    // 2. Phần thống kê tổng quát (Sử dụng dữ liệu finalStats của bạn)
    doc.setFontSize(14);
    doc.text("1. Thong ke tong quan", 14, 35);

    autoTable(doc, {
      startY: 40,
      head: [['Tong don dat', 'Da xac nhan', 'Cho thanh toan', 'Doanh thu']],
      body: [[
        finalStats.total,
        finalStats.confirmed,
        finalStats.pending,
        `${finalStats.revenue.toLocaleString('vi-VN')} VND`
      ]],
      theme: 'grid',
      styles: { fontSize: 10 }
    });

    // 3. Danh sách đơn hàng chi tiết
    doc.text("2. Danh sach don hang chi tiet", 14, (doc as any).lastAutoTable.finalY + 15);

    const tableData = filtered.map((o, index) => [
      index + 1,
      o._id.slice(-6).toUpperCase(),
      o.type === 'booking' ? 'Dat san' : 'Thue do',
      typeof o.userId === 'object' ? o.userId.fullName : 'N/A',
      o.type === 'booking' ? (o as Booking).facilityName : (o as Rental).equipmentId.name,
      o.status,
      o.type === 'booking' ? `${(o as Booking).price.toLocaleString()} VND` : `${(o as Rental).totalPrice.toLocaleString()} VND`
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['STT', 'Ma don', 'Loai', 'Khach hang', 'Dich vu', 'Trang thai', 'Gia tiền']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [0, 123, 229] }, // Màu xanh blue-600
      styles: { fontSize: 8 }
    });

    // 4. Lưu file
    doc.save(`Bao_cao_SAMS_${new Date().getTime()}.pdf`);
  };

  const filtered = orders.filter((o) => {
    // 1. Bộ lọc Loại đơn 
    if (typeFilter !== "Tất cả") {
      // So sánh trực tiếp typeFilter (booking/rental) với o.type
      if (o.type !== typeFilter) {
        return false;
      }
    }
    // 1. Bộ lọc Trạng thái (Status & Payment Filter)
    if (statusFilter !== "Tất cả") {
      const statusMap: Record<string, string[]> = {
        "Đã xác nhận": ["confirmed", "CONFIRMED"],
        "Chưa thanh toán": ["pending", "PENDING", "unpaid", "UNPAID"],
        // "Hoàn thành": ["completed", "COMPLETED"],
        // "Không đến": ["no_show", "NO_SHOW"],
        "Đã hủy": ["cancelled", "CANCELLED"],
      };

      const targetStatuses = statusMap[statusFilter];

      if (targetStatuses) {
        const currentStatus = o.status;
        // Lấy paymentStatus nếu là đơn booking, nếu không có thì để chuỗi rỗng
        const paymentStatus = o.type === 'booking' ? (o as Booking).paymentStatus : '';

        // Kiểm tra: Trạng thái chính khớp HOẶC Trạng thái thanh toán khớp (cho trường hợp Chưa thanh toán)
        const isStatusMatch = targetStatuses.includes(currentStatus);
        const isPaymentMatch = targetStatuses.includes(paymentStatus);

        if (!isStatusMatch && !isPaymentMatch) {
          return false;
        }
      }
    }

    // 2. Bộ lọc Ngày (Date filter)
    if (dateFilter) {
      const filterDate = new Date(dateFilter).toDateString();
      let orderDate: string;

      if (o.type === 'booking') {
        orderDate = new Date((o as Booking).date).toDateString();
      } else {
        orderDate = new Date((o as Rental).rentalDate).toDateString();
      }

      if (orderDate !== filterDate) {
        return false;
      }
    }

    // 3. Bộ lọc Tìm kiếm (Search filter)
    const searchTerm = search.toLowerCase();

    // Thông tin User
    const userName = typeof o.userId === 'object' ? (o.userId.fullName || '').toLowerCase() : '';
    const userEmail = typeof o.userId === 'object' ? (o.userId.email || '').toLowerCase() : '';

    // Kiểm tra ID, Tên, Email
    const matchId = o._id.toLowerCase().includes(searchTerm);
    const matchName = userName.includes(searchTerm);
    const matchEmail = userEmail.includes(searchTerm);

    // Kiểm tra Tên sân hoặc Tên thiết bị
    let matchAsset = false;
    if (o.type === 'booking') {
      matchAsset = (o as Booking).facilityName.toLowerCase().includes(searchTerm);
    } else {
      matchAsset = (o as Rental).equipmentId?.name.toLowerCase().includes(searchTerm);
    }

    return matchId || matchName || matchEmail || matchAsset;
  });

  // Logic hiển thị Loading giữ nguyên
  if (loading) {
    return (
      <div className="flex flex-col gap-8 pt-4">
        <PageHeader
          title="Quản lý đơn đặt"
          subtitle="Theo dõi và quản lý tất cả các đơn đặt trong hệ thống"
        />
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8 pt-4">
        <PageHeader
          title="Quản lý đơn đặt"
          subtitle="Theo dõi và quản lý tất cả các đơn đặt trong hệ thống"
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">

        <PageHeader
          title="Quản lý đơn đặt"
          subtitle="Theo dõi và quản lý tất cả các đơn đặt trong hệ thống"
        />
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
        >
          <FileText className="w-4 h-4" />
          Xuất báo cáo (PDF)
        </button>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statsCards.map((item) => (
          <StatCard
            key={item.id}
            title={item.title}
            value={item.value}
            colorClass={item.color}
            icon={item.icon}
          />
        ))}
      </div>

      {/* Bộ lọc tìm kiếm */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-600" /> Bộ lọc tìm kiếm
        </h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">Tìm kiếm</label>
            <input
              type="text"
              placeholder="Mã booking, tên người dùng, sân..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
            />
          </div>

          <div className="flex gap-4 items-end flex-wrap">
            {/* Bộ lọc Loại hình (Mới) */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Loại đơn</label>
              <select
                value={typeFilter} // Khai báo: const [typeFilter, setTypeFilter] = useState("Tất cả")
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-40 bg-white focus:ring-2 focus:ring-blue-500 text-gray-800"
              >
                <option>Tất cả</option>
                <option value="booking">Đặt sân</option>
                <option value="rental">Thuê thiết bị</option>
              </select>
            </div>

            {/* Bộ lọc Trạng thái (Đã thêm Đã hủy) */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-700 mb-1">Trạng thái</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-48 bg-white focus:ring-2 focus:ring-blue-500 text-gray-800"
              >
                <option>Tất cả</option>
                <option>Đã xác nhận</option>
                <option>Chưa thanh toán</option>
                <option>Đã hủy</option> {/* Đã bổ sung */}
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">Ngày</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
          </div>

          <div className="flex gap-2 ml-auto">
            <button className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 flex items-center gap-2">
              <Search size={14} /> Tìm kiếm
            </button>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("Tất cả");
                setDateFilter("");
              }}
              className="text-sm border border-gray-300 px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách đơn */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-800 mb-1">
          Danh sách đơn đặt
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Theo dõi tình trạng mượn/trả dụng cụ
        </p>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Không có đơn đặt nào
            </div>
          ) : (
            filtered.map((o) => {
              const statusMap = o.type === 'booking' ? {
                pending: "Chưa thanh toán",
                confirmed: "Đã xác nhận",
                completed: "Hoàn thành",
                cancelled: "Đã hủy",
                no_show: "Không đến",
                renting: "Đang thuê"
              } : {
                renting: "Đang thuê",
                completed: "Hoàn thành",
                cancelled: "Đã hủy",
              };

              const paymentStatusMap = {
                unpaid: "Chưa thanh toán",
                paid: "Đã thanh toán",
                refunded: "Đã hoàn tiền",
              };

              const statusColor = o.type === 'booking' ? {
                pending: "bg-yellow-100 text-yellow-700",
                confirmed: "bg-green-100 text-green-700",
                completed: "bg-blue-100 text-blue-700",
                cancelled: "bg-red-100 text-red-700",
                no_show: "bg-red-100 text-red-700",
                unpaid: "bg-yellow-100 text-yellow-700",
              } : {
                renting: "bg-blue-100 text-blue-700",
                completed: "bg-green-100 text-green-700",
                cancelled: "bg-red-100 text-red-700",
              };

              return (
                <div
                  key={o._id}
                  className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div>
                    {/* Header ID + Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-800">{o._id.slice(-8).toUpperCase()}</p>

                      {/* 1. Tag Loại đơn */}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.type === 'booking' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                        {o.type === 'booking' ? 'Đặt sân' : 'Thuê thiết bị'}
                      </span>

                      {/* 2. Tag Trạng thái chính (DUY NHẤT) */}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${(statusColor as any)[o.status] || "bg-gray-100 text-gray-700"}`}
                      >
                        {/* Ưu tiên hiển thị nhãn "Chưa thanh toán" cho đơn booking pending/unpaid, còn lại lấy từ statusMap */}
                        {o.type === 'booking' && (o.status === 'pending' || (o.status as string) === 'unpaid')
                          ? "Chưa thanh toán"
                          : (statusMap as any)[o.status]
                        }
                      </span>

                      {/* 3. Tag Thanh toán chi tiết (Chỉ hiện khi đã thanh toán hoặc hoàn tiền để tránh lặp với tag Chưa thanh toán ở trên) */}
                      {o.type === 'booking' && (o as Booking).paymentStatus !== 'unpaid' && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${(o as Booking).paymentStatus === 'paid'
                            ? 'bg-green-50 text-green-600 border border-green-200'
                            : 'bg-blue-50 text-blue-600 border border-blue-200'
                            }`}
                        >
                          {paymentStatusMap[(o as Booking).paymentStatus]}
                        </span>
                      )}

                      {/* 4. Icon cảnh báo vắng mặt */}
                      {o.type === 'booking' && o.status === "no_show" && (
                        <Ban className="w-4 h-4 text-red-500 ml-1" />
                      )}
                    </div>

                    {/* Details */}
                    <p className="text-sm text-gray-600 flex items-center gap-3 mt-1 flex-wrap">
                      <User size={14} /> {typeof o.userId === 'object' ? o.userId.fullName : 'N/A'}
                      <Package size={14} />{' '}
                      {o.type === 'booking'
                        ? (o as Booking).facilityName
                        : (o as Rental).equipmentId.name}
                      <Calendar size={14} /> {o.type === 'booking' ? new Date((o as Booking).date).toLocaleDateString('vi-VN') : new Date((o as Rental).rentalDate).toLocaleDateString('vi-VN')}
                      <Clock size={14} /> {o.type === 'booking' ? (o as Booking).timeSlot : `${(o as Rental).duration}h`}
                    </p>

                    <p className="text-sm text-gray-700 mt-1 font-medium flex items-center gap-2">
                      <Wallet2 size={14} /> {(o.type === 'booking' ? (o as Booking).price : (o as Rental).totalPrice).toLocaleString('vi-VN')}đ
                    </p>

                    {o.type === 'booking' && (o as Booking).checkinTime && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <Footprints size={13} className="text-gray-600" />
                        Checkin: {new Date((o as Booking).checkinTime!).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        {(o as Booking).checkoutTime && ` — Checkout: ${new Date((o as Booking).checkoutTime!).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-2 rounded-md bg-gray-100 hover:bg-blue-100 transition"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4 text-gray-700 hover:text-blue-700" />
                    </button>
                    {o.type === 'booking' && o.status === 'pending' && (
                      <button
                        onClick={() => handleConfirmBooking(o._id)}
                        className="p-2 rounded-md bg-green-100 hover:bg-green-200 transition"
                        title="Xác nhận"
                      >
                        <CheckCircle className="w-4 h-4 text-green-700" />
                      </button>
                    )}
                    {o.type === 'booking' && o.status === 'confirmed' && !(o as Booking).checkinTime && (
                      <button
                        onClick={() => handleCheckinBooking(o._id)}
                        className="p-2 rounded-md bg-blue-100 hover:bg-blue-200 transition"
                        title="Check-in"
                      >
                        <LogIn className="w-4 h-4 text-blue-700" />
                      </button>
                    )}
                    {((o.type === 'booking' && o.status !== 'completed' && o.status !== 'cancelled') ||
                      (o.type === 'rental' && o.status !== 'completed' && o.status !== 'cancelled')) && (
                        <button
                          onClick={() => o.type === 'booking' ? handleCancelBooking(o._id) : handleCancelRental(o._id)}
                          className="p-2 rounded-md bg-red-100 hover:bg-red-200 transition"
                          title="Hủy"
                        >
                          <XCircle className="w-4 h-4 text-red-700" />
                        </button>
                      )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative w-[500px] max-h-[80vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Chi tiết đơn {selectedOrder.type === 'booking' ? 'đặt' : 'thuê'} #{selectedOrder._id.slice(-8).toUpperCase()}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Người đặt</label>
                  <p className="text-sm text-gray-900">
                    {typeof selectedOrder.userId === 'object' ? selectedOrder.userId.fullName : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {typeof selectedOrder.userId === 'object' ? selectedOrder.userId.email : ''}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {selectedOrder.type === 'booking' ? 'Sân' : 'Thiết bị'}
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedOrder.type === 'booking'
                      ? (selectedOrder as Booking).facilityName
                      : (selectedOrder as Rental).equipmentId.name}
                  </p>
                  {selectedOrder.type === 'booking' && (
                    <p className="text-xs text-gray-500">{(selectedOrder as Booking).facilityLocation}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {selectedOrder.type === 'booking' ? 'Ngày đặt' : 'Ngày thuê'}
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedOrder.type === 'booking'
                      ? new Date((selectedOrder as Booking).date).toLocaleDateString('vi-VN')
                      : new Date((selectedOrder as Rental).rentalDate).toLocaleDateString('vi-VN')
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {selectedOrder.type === 'booking' ? 'Khung giờ' : 'Thời gian'}
                  </label>
                  <p className="text-sm text-gray-900">
                    {selectedOrder.type === 'booking' ? (selectedOrder as Booking).timeSlot : `${(selectedOrder as Rental).duration}h`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                      // Chuyển về chữ thường để so sánh màu chính xác
                      selectedOrder.status.toLowerCase() === 'confirmed' ? 'bg-green-100 text-green-700' :
                        ['pending', 'unpaid'].includes(selectedOrder.status.toLowerCase()) ? 'bg-yellow-100 text-yellow-700' :
                          ['completed', 'renting'].includes(selectedOrder.status.toLowerCase()) ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                      }`}
                  >
                    {selectedOrder.type === 'booking' ? (
                      // Kiểm tra cho đơn Đặt sân
                      ['pending', 'unpaid'].includes(selectedOrder.status.toLowerCase()) ? 'Chờ thanh toán' :
                        selectedOrder.status.toLowerCase() === 'confirmed' ? 'Đã xác nhận' :
                          selectedOrder.status.toLowerCase() === 'completed' ? 'Hoàn thành' :
                            selectedOrder.status.toLowerCase() === 'cancelled' ? 'Đã hủy' : 'Không đến'
                    ) : (
                      // Kiểm tra cho đơn Thuê thiết bị
                      selectedOrder.status.toLowerCase() === 'renting' ? 'Đang thuê' :
                        selectedOrder.status.toLowerCase() === 'completed' ? 'Hoàn thành' : 'Đã hủy'
                    )}
                  </span>
                </div>

                {selectedOrder.type === 'booking' && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Thanh toán</label>
                    <span
                      className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${(selectedOrder as Booking).paymentStatus?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-700' :
                        (selectedOrder as Booking).paymentStatus?.toLowerCase() === 'refunded' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                    >
                      {(selectedOrder as Booking).paymentStatus?.toLowerCase() === 'paid' ? 'Đã thanh toán' :
                        (selectedOrder as Booking).paymentStatus?.toLowerCase() === 'refunded' ? 'Đã hoàn tiền' : 'Chưa thanh toán'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Giá tiền</label>
                <p className="text-lg font-semibold text-blue-600">
                  {(selectedOrder.type === 'booking' ? (selectedOrder as Booking).price : (selectedOrder as Rental).totalPrice).toLocaleString('vi-VN')}đ
                </p>
              </div>

              {selectedOrder.type === 'booking' && (selectedOrder as Booking).checkinTime && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Check-in</label>
                    <p className="text-sm text-gray-900">
                      {new Date((selectedOrder as Booking).checkinTime!).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  {(selectedOrder as Booking).checkoutTime && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Check-out</label>
                      <p className="text-sm text-gray-900">
                        {new Date((selectedOrder as Booking).checkoutTime!).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedOrder.type === 'booking' && (selectedOrder as Booking).notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Ghi chú</label>
                  <p className="text-sm text-gray-900">{(selectedOrder as Booking).notes}</p>
                </div>
              )}

              {selectedOrder.type === 'booking' && (selectedOrder as Booking).cancelReason && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Lý do hủy</label>
                  <p className="text-sm text-gray-900">{(selectedOrder as Booking).cancelReason}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
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

export default OrdersManagement;