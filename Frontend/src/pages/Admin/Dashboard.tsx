import StatCard from "@/components/Admin/StatCard";
import PageHeader from "@/components/Admin/PageHeader";
import {
  Calendar,
  Package,
  DollarSign,
  Activity,
  Dumbbell,
  Clock,
  X,
  User,
} from "lucide-react";

import equipmentService, {
  type GroupedEquipment,
} from "@/services/equipmentService";
import bookingService, { type CourtBooking } from "@/services/bookingService";
import { useEffect, useState } from "react";

// --- HELPER FUNCTIONS ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Helper lấy tên User
const getUserName = (user: any) => {
  if (!user) return "Khách vãng lai";
  if (typeof user === "object" && user.fullName) {
    return user.fullName;
  }
  return `User: ${String(user).slice(-4)}`;
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "confirmed":
    case "completed":
    case "paid":
      return { text: "Đã xác nhận", color: "bg-green-100 text-green-700" };
    case "pending":
      return { text: "Chờ xử lý", color: "bg-yellow-100 text-yellow-700" };
    case "cancelled":
      return { text: "Đã hủy", color: "bg-red-100 text-red-700" };
    case "no_show":
      return { text: "Vắng mặt", color: "bg-gray-100 text-gray-700" };
    default:
      return { text: status, color: "bg-gray-100 text-gray-700" };
  }
};

// --- MODAL COMPONENT ---
interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  bookings: CourtBooking[];
}

const BookingModal = ({
  isOpen,
  onClose,
  title,
  bookings,
}: BookingModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[85vh] w-full max-w-4xl flex-col rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {bookings.length === 0 ? (
            <p className="py-8 text-center text-gray-500">Không có dữ liệu.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => {
                const statusConfig = getStatusConfig(b.status);
                return (
                  <div
                    key={b._id}
                    className="flex flex-col justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 transition hover:bg-white hover:shadow-md sm:flex-row sm:items-center"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-blue-700">
                          {b.timeSlot}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(b.date).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <p className="mt-1 font-medium text-gray-800">
                        {b.facilityName}
                      </p>
                      {/* Hiển thị tên user trong Modal */}
                      <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                        <User className="h-3 w-3" />
                        <span className="font-medium text-blue-600">
                          {getUserName(b.userId)}
                        </span>
                      </div>
                      {b.notes && (
                        <p className="mt-1 text-xs text-gray-500 italic">
                          Ghi chú: {b.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex min-w-[120px] items-center justify-between gap-4 sm:justify-end">
                      <div className="text-right">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusConfig.color}`}
                        >
                          {statusConfig.text}
                        </span>
                        <p className="mt-1 font-bold text-gray-800">
                          {formatCurrency(b.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end rounded-b-xl border-t border-gray-100 bg-gray-50 p-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const Dashboard = () => {
  const [availableEquipments, setAvailableEquipments] = useState<
    GroupedEquipment[]
  >([]);
  const [rentedEquipments, setRentedEquipments] = useState<GroupedEquipment[]>(
    [],
  );
  const [maintenanceEquipments, setMaintenanceEquipments] = useState<
    GroupedEquipment[]
  >([]);

  const [todayBookings, setTodayBookings] = useState<CourtBooking[]>([]);
  const [allRecentBookings, setAllRecentBookings] = useState<CourtBooking[]>(
    [],
  );

  const [revenueToday, setRevenueToday] = useState(0);
  const [bookedSlotsCount, setBookedSlotsCount] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    equipmentService
      .getAllGroupedEquipment("available")
      .then(setAvailableEquipments);
    equipmentService.getAllGroupedEquipment("rented").then(setRentedEquipments);
    equipmentService
      .getAllGroupedEquipment("maintenance")
      .then(setMaintenanceEquipments);

    const fetchBookingData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        const bookingsTodayData = await bookingService.getAllBookings({
          date: today,
        });
        setTodayBookings(bookingsTodayData);

        const validBookings = bookingsTodayData.filter(
          (b) => b.status !== "cancelled",
        );
        setBookedSlotsCount(validBookings.length);

        const revenue = validBookings.reduce((sum, b) => {
          if (
            b.paymentStatus === "paid" ||
            b.status === "completed" ||
            b.status === "confirmed"
          ) {
            return sum + b.price;
          }
          return sum;
        }, 0);
        setRevenueToday(revenue);

        const allRecent = await bookingService.getAllBookings();
        setAllRecentBookings(allRecent);
      } catch (error) {
        console.error("Failed to fetch dashboard booking data", error);
      }
    };

    fetchBookingData();
  }, []);

  const openRecentModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const totalRented = rentedEquipments.reduce((sum, e) => sum + e.total, 0);
  const totalAvailable = availableEquipments.reduce(
    (sum, e) => sum + e.total,
    0,
  );
  const totalMaintenance = maintenanceEquipments.reduce(
    (sum, e) => sum + e.total,
    0,
  );
  const TOTAL_SLOTS_PER_DAY = 12;
  const utilizationRate = Math.round(
    (bookedSlotsCount / TOTAL_SLOTS_PER_DAY) * 100,
  );

  const stats = [
    {
      id: 1,
      title: "Khung giờ đã đặt hôm nay",
      value: `${bookedSlotsCount}/${TOTAL_SLOTS_PER_DAY}`,
      note: "Số liệu thực tế",
      color: "text-blue-600",
      icon: (
        <div className="rounded-lg bg-blue-50 p-2">
          <Calendar className="h-5 w-5 text-blue-600" />
        </div>
      ),
    },
    {
      id: 2,
      title: "Thiết bị đang sử dụng",
      value: `${totalRented}/${totalAvailable + totalRented + totalMaintenance}`,
      note: `${totalMaintenance} thiết bị đang bảo trì`,
      color: "text-green-600",
      icon: (
        <div className="rounded-lg bg-green-50 p-2">
          <Package className="h-5 w-5 text-green-600" />
        </div>
      ),
    },
    {
      id: 3,
      title: "Doanh thu hôm nay",
      value: formatCurrency(revenueToday),
      note: "Đã xác nhận/Thanh toán",
      color: "text-yellow-600",
      icon: (
        <div className="rounded-lg bg-yellow-50 p-2">
          <DollarSign className="h-5 w-5 text-yellow-600" />
        </div>
      ),
    },
    {
      id: 4,
      title: "Tỉ lệ sử dụng sân",
      value: `${utilizationRate}%`,
      note: "Dựa trên slot đã đặt",
      color: "text-purple-600",
      icon: (
        <div className="rounded-lg bg-purple-50 p-2">
          <Activity className="h-5 w-5 text-purple-600" />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 pt-4">
      <PageHeader
        title="Tổng quan"
        subtitle="Theo dõi tình hình thiết bị và sân trong ngày"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard
            key={item.id}
            title={item.title}
            value={item.value}
            note={item.note}
            colorClass={item.color}
            icon={item.icon}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* === WIDGET: Đặt lịch mới nhất === */}
        <div className="flex h-full flex-col rounded-xl border border-gray-300 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-800">
              Đặt lịch mới nhất
            </h2>
          </div>
          <div className="flex-1 space-y-3">
            {allRecentBookings.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500">
                Chưa có đơn đặt sân nào.
              </p>
            ) : (
              // Chỉ hiển thị tối đa 3 items
              allRecentBookings.slice(0, 3).map((b) => {
                const statusConfig = getStatusConfig(b.status);
                return (
                  <div
                    key={b._id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4"
                  >
                    <div>
                      <p className="font-medium text-gray-700">{b.timeSlot}</p>
                      <p className="text-sm text-gray-600">{b.facilityName}</p>
                      <p className="mt-1 flex items-center gap-1 text-sm font-medium text-blue-600">
                        <User className="h-3 w-3" />
                        {getUserName(b.userId)}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(b.date).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${statusConfig.color}`}
                      >
                        {statusConfig.text}
                      </span>
                      <p className="mt-2 text-sm font-semibold text-gray-700">
                        {formatCurrency(b.price)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div
            onClick={openRecentModal}
            className="mt-4 cursor-pointer rounded-md border border-gray-300 py-2 text-center text-sm font-medium text-gray-800 transition select-none hover:bg-gray-50 active:bg-gray-100"
          >
            Xem tất cả ({allRecentBookings.length})
          </div>
        </div>

        {/* === WIDGET: Tình trạng thiết bị === */}
        <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Tình trạng thiết bị
            </h2>
          </div>
          <div className="custom-scrollbar max-h-96 space-y-4 overflow-y-auto pr-2">
            {availableEquipments.map((item) => {
              // SỬA: Tính phần trăm theo (Số lượng hiện có / Tổng kho)
              const percent = (item.total / item.equipment.quantity) * 100;
              return (
                <div key={item.equipment._id}>
                  <div className="mb-1 flex justify-between text-sm text-gray-600">
                    <span>{item.equipment.name}</span>
                    {/* SỬA: Hiển thị đúng logic Số lượng / Tổng kho */}
                    <span>
                      {item.total}/{item.equipment.quantity}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${Math.min(percent, 100)}%` }} // Giới hạn max 100% để tránh tràn
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={closeModal}
        title="Tất cả các lịch đặt gần đây"
        bookings={allRecentBookings}
      />
    </div>
  );
};

export default Dashboard;
