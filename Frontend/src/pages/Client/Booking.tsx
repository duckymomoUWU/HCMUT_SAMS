// Frontend/src/pages/Client/Booking.tsx
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CalendarDays, Clock, CheckCircle2, AlertCircle, Loader2, User as UserIcon, MapPin } from "lucide-react";
import PageHeader from "@/components/Admin/PageHeader";
import StatCard from "@/components/Admin/StatCard";
import Calendar from "react-calendar";
import './calendar.css';
import "@/pages/Client/calendar.css";
import api from "@/services/api"; // Import the api service

// Define types for our data
interface TimeSlot {
  time: string;
  start: string;
  end: string;
  price: number;
  status: 'available' | 'booked' | 'maintenance';
}

interface BookingStat {
  _id: string;
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'PAID' | 'CANCELLED' | 'FAILED' | 'CHECKED_IN';
}

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phone?: string;
}

// Placeholder for Facility details, ideally fetched from API
interface FacilityDetails {
  id: string;
  name: string;
  type: string;
  location: string;
}

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]); // Changed to array
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingBooking, setLoadingBooking] = useState(false);
  
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, cancelled: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);  

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);  

  // Hardcode a facility ID for now. In a real app, this would be dynamic.
  const facilityId = "693e4cd7dbb31d28519de71b"; // Replace with a REAL ID from your DB
  // Fetch facility details along with slots or once (for type, name, location)
  const [facilityDetails, setFacilityDetails] = useState<FacilityDetails | null>(null);
  
  // Handler for multi-slot selection
  const handleSlotClick = (slot: TimeSlot) => {
    setSelectedSlots(prevSelected => {
      const isAlreadySelected = prevSelected.some(s => s.time === slot.time);
      if (isAlreadySelected) {
        // If already selected, remove it
        return prevSelected.filter(s => s.time !== slot.time);
      } else {
        // If not selected, add it
        return [...prevSelected, slot];
      }
    });
  };

  // Fetch user profile on component mount (for Booker name)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUserProfile(response.data.user);
        }
      } catch (err: any) { // Add ': any' for err type for consistent error handling
        console.error("Failed to fetch user profile:", err);
        const errorMessage = err.response?.data?.message || "Không thể tải thông tin người dùng.";
        toast.error(errorMessage);
        setUserProfile(null); // Ensure userProfile is null if fetch fails
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const response = await api.get('/booking/history?type=all');
        const userBookings: BookingStat[] = response.data;
        
        const approved = userBookings.filter(b => ['PAID', 'CONFIRMED', 'CHECKED_IN'].includes(b.status)).length;
        const pending = userBookings.filter(b => b.status === 'PENDING_PAYMENT').length;
        const cancelled = userBookings.filter(b => ['CANCELLED', 'FAILED'].includes(b.status)).length;
        
        setStats({
          total: userBookings.length,
          approved,
          pending,
          cancelled,
        });
      } catch (err) {
        console.error("Failed to fetch booking stats:", err);
        // Don't show a fatal error for stats, just default to 0
        setStats({ total: 0, approved: 0, pending: 0, cancelled: 0 });
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch available slots and facility details when date changes
  useEffect(() => {
    const fetchSlotsAndFacility = async () => {
      setLoadingSlots(true);
      setSelectedSlots([]); // Reset selection to empty array
      try {
        // Fetch facility details (assuming /facility/:id endpoint exists)
        setFacilityDetails({
          id: facilityId,
          name: "Sân Cầu Lông B1",
          type: "Badminton",
          location: "Nhà thi đấu Thể thao, Cơ sở Dĩ An"
        });

        const dateString = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const response = await api.get(`/booking/availability/${facilityId}?date=${dateString}`);
        setSlots(response.data);
      } catch (err) {
        toast.error("Không thể tải danh sách khung giờ. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlotsAndFacility();
  }, [selectedDate, facilityId]);
  
  const handleConfirmBooking = async () => {
    if (selectedSlots.length === 0) return;

    setLoadingBooking(true);

    try {
      // Create a payload that matches the backend's new CreateBookingDto
      const bookingPayload = {
        facilityId: facilityId,
        bookingDate: selectedDate.toISOString().split('T')[0],
        slots: selectedSlots.map(slot => ({
          startTime: slot.start,
          endTime: slot.end,
          price: slot.price,
        })),
      };

      // The endpoint is now back to /booking
      const response = await api.post('/booking', bookingPayload);
      
      const { paymentUrl } = response.data;

      if (paymentUrl) {
        // Redirect the user to the payment gateway
        window.location.href = paymentUrl;
      } else {
        // Fallback or error if no paymentUrl is received
        toast.error("Không thể lấy được liên kết thanh toán. Vui lòng thử lại.");
        setShowConfirm(false);
      }

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Đã xảy ra lỗi khi tạo đơn đặt sân.";
      toast.error(errorMessage);
      setShowConfirm(false); // Close the modal on error
    } finally {
      setLoadingBooking(false);
    }
  };

  const statCards = [
    { id: 1, title: "Tổng số đơn đặt", value: loadingStats ? '--' : stats.total },
    { id: 2, title: "Đơn đã duyệt", value: loadingStats ? '--' : stats.approved },
    { id: 3, title: "Đơn đang xử lý", value: loadingStats ? '--' : stats.pending },
    { id: 4, title: "Đơn bị hủy", value: loadingStats ? '--' : stats.cancelled },
  ];

  const totalOrderPrice = selectedSlots.reduce((sum, slot) => sum + slot.price, 0);

  return (
    <div className="flex flex-col gap-8 pt-4">
      <PageHeader
        title="Đặt sân thể thao"
        subtitle="Chọn ngày và khung giờ để đặt sân"
      />
    
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((s) => (
          <StatCard key={s.id} title={s.title} value={s.value.toString()} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-blue-500" />
            Chọn ngày đặt sân
          </h3>
          <div className="calendar-wrapper">
            <Calendar
              onChange={(value) => setSelectedDate(value as Date)}
              value={selectedDate}
              locale="vi-VN"
              minDate={new Date()}
              maxDate={maxDate}
              navigationLabel={({ label, view, date }) => {
                if (label && label.length > 0) {
                  return label.charAt(0).toUpperCase() + label.slice(1);
                }
                return label;
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-blue-500" />
            Chọn khung giờ
          </h3>
          {loadingSlots ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : !slots.length ? (
             <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Không thể tải danh sách khung giờ. Vui lòng thử lại.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {slots.map((slot) => {
                const isSelected = selectedSlots.some(s => s.time === slot.time); // Updated isSelected
                const isBooked = slot.status === "booked";
                const isMaintenance = slot.status === "maintenance";

                // Check if the slot is in the past
                const now = new Date();
                const slotDateTime = new Date(selectedDate);
                const [hours, minutes] = slot.start.split(':').map(Number);
                slotDateTime.setHours(hours, minutes, 0, 0);
                const isPast = slotDateTime < now;

                return (
                  <button
                    key={slot.time}
                    onClick={() =>
                      !isBooked && !isMaintenance && !isPast && handleSlotClick(slot) // Updated onClick
                    }
                    disabled={isBooked || isMaintenance || isPast}
                    className={`py-2 text-sm border rounded-md transition font-medium ${isBooked || isPast ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : isMaintenance ? "bg-yellow-50 text-yellow-700 cursor-not-allowed border-yellow-100" : isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600"}`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          )}
          {selectedSlots.length > 0 && (
            <div className="mt-4 text-sm text-blue-700 bg-blue-50 p-3 rounded-md flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Đã chọn:{" "}
              <span className="font-medium">{selectedSlots.length} khung giờ</span>
            </div>
          )}
          {selectedSlots.length > 0 && !showConfirm && (
            <div className="flex justify-center mt-6">
              <button onClick={() => setShowConfirm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition">
                Đặt sân
              </button>
            </div>
          )}
        </div>
      </div>

      {showConfirm && selectedSlots.length > 0 && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[400px] p-6 relative">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Thông tin đặt sân</h3>
            <p className="text-sm text-gray-500 mb-4">Vui lòng kiểm tra thông tin trước khi xác nhận.</p>
            <div className="space-y-3 text-sm text-gray-700 border-t border-b py-4">
              <p><span className="font-medium text-gray-500">Người đặt:</span> {userProfile?.fullName || 'Đang tải...'}</p>
              <p><span className="font-medium text-gray-500">Ngày đặt:</span> {selectedDate.toLocaleDateString("vi-VN")}</p>
              <div className="space-y-1">
                <p className="font-medium text-gray-500">Khung giờ đã chọn:</p>
                <ul className="list-disc list-inside pl-2">
                  {selectedSlots.map(slot => (
                    <li key={slot.time}>{slot.time}</li>
                  ))}
                </ul>
              </div>
              <p><span className="font-medium text-gray-500">Vị trí sân:</span> {facilityDetails?.location || 'Đang tải...'}</p>
            </div>
            
            <div className="flex flex-col items-center text-base font-medium mt-4">
              <span className="text-gray-900">Tổng thanh toán:</span>
              <span className="text-blue-600 text-xl font-bold mt-2">{totalOrderPrice.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50" disabled={loadingBooking}>Hủy</button>
              <button onClick={handleConfirmBooking} className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 flex items-center gap-2" disabled={loadingBooking}>
                {loadingBooking && <Loader2 className="w-4 h-4 animate-spin" />}
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;