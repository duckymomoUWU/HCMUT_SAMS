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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

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
    prompt('Lý do hủy (tùy chọn):');
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

    // Hàm hỗ trợ xóa dấu tiếng Việt để tránh lỗi ký tự lạ "&T&r&§"
    const removeVietnameseTones = (str: string) => {
      if (!str) return "N/A";
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/\s+/g, ' ') // Xóa khoảng trắng thừa giữa các chữ
        .trim();
    };

    const today = new Date().toLocaleDateString('vi-VN');

    // 1. Tiêu đề
    doc.setFontSize(18);
    doc.text("BAO CAO HE THONG QUAN LY SAMS", 105, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Ngay xuat: ${today}`, 105, 22, { align: 'center' });

    // 2. Thống kê tổng quát
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
      styles: { font: "courier" }
    });

    // 3. Danh sách chi tiết
    doc.text("2. Danh sach don hang chi tiet", 14, (doc as any).lastAutoTable.finalY + 15);

    const tableData = filtered.map((o, index) => {
      // Xử lý Khách hàng: Dùng Optional Chaining an toàn
      const rawUserName = (o.userId as any)?.fullName || 'N/A';
      const cleanUserName = removeVietnameseTones(rawUserName);

      // Xử lý Dịch vụ
      const rawAssetName = o.type === 'booking'
        ? (o as Booking).facilityName
        : (o as Rental).equipmentId?.name || 'Thiet bi';
      const cleanAssetName = removeVietnameseTones(rawAssetName);

      // Xử lý Giá tiền
      const price = o.type === 'booking'
        ? (o as Booking).price
        : (o as Rental).totalPrice || 0;

      return [
        index + 1,
        o._id.slice(-6).toUpperCase(),
        o.type === 'booking' ? 'Dat san' : 'Thue do',
        cleanUserName,
        cleanAssetName,
        o.status, // Giữ nguyên mã status tiếng Anh (confirmed, renting, locked...)
        `${price.toLocaleString('vi-VN')} VND`
      ];
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [['STT', 'Ma don', 'Loai', 'Khach hang', 'Dich vu', 'Trang thai', 'Gia tien']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [0, 123, 229] },
      styles: { font: "Display Fonts", fontSize: 8 }, // Courier hiển thị bảng tốt hơn khi không có font Unicode
    });

    doc.save(`Bao_cao_SAMS_${new Date().getTime()}.pdf`);
  };

  const filtered = orders.filter((o) => {
    // 1. Lọc Loại đơn
    if (typeFilter !== "Tất cả" && o.type !== typeFilter) return false;

    // 2. Lọc Trạng thái & Thanh toán
    if (statusFilter !== "Tất cả") {
      const statusMap: Record<string, string[]> = {
        "Đã xác nhận": ["confirmed", "CONFIRMED"],
        "Đang thuê": ["renting", "RENTING"],
        "Đã thanh toán": ["paid", "PAID", "success"],
        "Chưa thanh toán": ["unpaid", "UNPAID", "pending", "PENDING"],
        "Đã hủy": ["cancelled", "CANCELLED"],
      };

      const targetCodes = statusMap[statusFilter];

      if (targetCodes) {
        const orderStatus = o.status?.toString().toLowerCase().trim();

        // SỬA TẠI ĐÂY: Truy xuất paymentStatus từ paymentId nếu có
        const payStatus = (
          (o as any).paymentStatus ||             // Trường hợp đơn Booking
          (o as any).paymentId?.status ||         // Trường hợp đơn Rental (Dựa trên JSON của bạn)
          ((o as any).paymentId ? "unpaid" : "")  // Nếu có ID mà chưa có status thì coi như chưa trả
        ).toString().toLowerCase().trim();

        const isMatch = targetCodes.some(code => {
          const cleanCode = code.toLowerCase().trim();
          return cleanCode === orderStatus || cleanCode === payStatus;
        });

        if (!isMatch) return false;
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

    const userName = (o.userId as any)?.fullName?.toLowerCase() || '';
    const userEmail = (o.userId as any)?.email?.toLowerCase() || '';

    // Kiểm tra ID, Tên, Email
    const matchId = o._id.toLowerCase().includes(searchTerm);
    const matchName = userName.includes(searchTerm);
    const matchEmail = userEmail.includes(searchTerm);

    // Kiểm tra Tên sân hoặc Tên thiết bị
    let matchAsset = false;
    if (o.type === 'booking') {
      matchAsset = (o as Booking).facilityName?.toLowerCase().includes(searchTerm) || false;
    } else {
      matchAsset = (o as Rental).equipmentId?.name?.toLowerCase().includes(searchTerm) || false;
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

          {/* Bộ lọc Loại đơn */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1 font-medium">Loại đơn</label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setStatusFilter("Tất cả");
              }}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-40 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tất cả">Tất cả</option>
              <option value="booking">Đặt sân</option>
              <option value="rental">Thuê thiết bị</option>
            </select>
          </div>

          {/* Bộ lọc Trạng thái linh hoạt */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1 font-medium">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-48 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Tất cả">Tất cả</option>

              {/* Hiện options dựa trên Loại đơn đang chọn */}
              {typeFilter === "booking" ? (
                <>
                  <option>Đã xác nhận</option>
                  <option>Đã thanh toán</option>
                  <option>Chưa thanh toán</option>
                  <option>Đã hủy</option>
                </>
              ) : typeFilter === "rental" ? (
                <>
                  <option>Đang thuê</option>
                  <option>Đã thanh toán</option>
                  <option>Chưa thanh toán</option>
                  <option>Đã hủy</option>
                </>
              ) : (
                <>
                  <option>Đã xác nhận</option>
                  <option>Đang thuê</option>
                  <option>Đã thanh toán</option>
                  <option>Chưa thanh toán</option>
                  <option>Đã hủy</option>
                </>
              )}
            </select>
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-800">{o._id.slice(-8).toUpperCase()}</p>

                      {/* 1. Tag Loại đơn */}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.type === 'booking' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                        {o.type === 'booking' ? 'Đặt sân' : 'Thuê thiết bị'}
                      </span>

                      {/* 2. Tag Trạng thái chính */}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${(statusColor as any)[o.status] || "bg-gray-100 text-gray-700"}`}
                      >
                        {o.type === 'booking' ? (
                          ['pending', 'unpaid'].includes(o.status.toLowerCase()) ? "Chờ thanh toán" : (statusMap as any)[o.status]
                        ) : (
                          // Trạng thái riêng cho Thiết bị
                          o.status.toLowerCase() === 'renting' ? "Đang thuê" : (statusMap as any)[o.status]
                        )}
                      </span>

                      {/* 3. Tag Thanh toán (Hiển thị cho cả Sân và Thiết bị) */}
                      {/* Kiểm tra logic paymentStatus: nếu là 'unpaid' thì hiện xám, 'paid' hiện xanh */}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${(o as any).paymentStatus === 'paid'
                          ? 'bg-green-50 text-green-600 border border-green-200'
                          : 'bg-gray-50 text-gray-600 border border-gray-200'
                          }`}
                      >
                        {(o as any).paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>

                      {/* 4. Icon cảnh báo vắng mặt (Chỉ dành cho sân) */}
                      {o.type === 'booking' && o.status === "no_show" && (
                        <Ban className="w-4 h-4 text-red-500 ml-1" />
                      )}
                    </div>

                    {/* Details */}
                    <p className="text-sm text-gray-600 flex items-center gap-3 mt-1 flex-wrap">
                      <User size={14} />
                      {/* Sửa lỗi fullName tại đây bằng cách dùng ?. và gán giá trị mặc định */}
                      {(o.userId as any)?.fullName || 'Người dùng không tồn tại'}

                      <Package size={14} />{' '}
                      {o.type === 'booking'
                        ? (o as Booking).facilityName
                        // Sửa lỗi equipmentId có thể bị null
                        : (o as Rental).equipmentId?.name || 'Thiết bị đã bị xóa'}

                      <Calendar size={14} />
                      {o.type === 'booking'
                        ? new Date((o as Booking).date).toLocaleDateString('vi-VN')
                        : new Date((o as Rental).rentalDate).toLocaleDateString('vi-VN')}

                      <Clock size={14} />
                      {o.type === 'booking'
                        ? (o as Booking).timeSlot
                        : `${(o as Rental).duration}h`}
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
                  {/* Xem, xóa, hủy, checkin đối với client*/}
                  <div className="flex items-center gap-1">
                    {o.userId ? (
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 active:scale-95"
                        title="Xem chi tiết đơn hàng"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    ) : (
                      <div
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-50 text-gray-300 cursor-not-allowed"
                        title="Người dùng không tồn tại"
                      >
                        <Eye className="w-5 h-5" />
                      </div>
                    )}

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