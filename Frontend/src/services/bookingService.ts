import api from "@/lib/Axios";

// Interface cho thông tin User đã populate
export interface BookingUser {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
}

export interface CourtBooking {
  _id: string;
  userId: BookingUser | string; // Có thể là object hoặc string
  facilityId: string;
  facilityName: string;
  facilityLocation: string;
  date: string;
  timeSlot: string;
  startTime: string;
  endTime: string;
  price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show" | "locked" | "unpaid";
  paymentStatus: "unpaid" | "paid" | "refunded";
  paymentId?: string;
  checkinTime?: string;
  checkoutTime?: string;
  notes?: string;
  cancelledAt?: string;
  cancelReason?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Time Slot Management Types
export interface TimeSlot {
  timeSlot: string;
  startTime: string;
  endTime: string;
  status: 'available' | 'booked' | 'locked';
  booking?: CourtBooking;
}

export interface TimeSlotStats {
  total: number;
  booked: number;
  available: number;
  locked: number;
}

export interface WeekSlotStats extends TimeSlotStats {
  date: string;
  dayOfWeek: string;
}

export interface MonthSlotStats extends TimeSlotStats {
  date: string;
  day: number;
}

export interface LockMultipleResult {
  timeSlot: string;
  success: boolean;
  booking?: CourtBooking;
  error?: string;
}

export interface CreateBookingDTO {
  facilityId: string;
  facilityName?: string;
  facilityLocation?: string;
  date: string;
  timeSlot: string;
  price: number;
  notes?: string;
}

class BookingService {
  async createBooking(
    data: CreateBookingDTO,
  ): Promise<{ booking: CourtBooking }> {
    const response = await api.post("/booking", data);
    return response.data;
  }

  async getMyBookings(): Promise<CourtBooking[]> {
    const response = await api.get("/booking/my-bookings");
    return response.data.bookings;
  }

  async getBookingById(id: string): Promise<CourtBooking> {
    const response = await api.get(`/booking/${id}`);
    return response.data.booking;
  }

  // Lấy các slot đã đặt hoặc bị khóa
  async getBookedSlots(facilityId: string, date: string): Promise<{ time: string; status: 'booked' | 'locked' }[]> {
    const response = await api.get("/booking/booked-slots", {
      params: { facilityId, date },
    });
    // Trả về array of { time, status }
    return response.data.bookedSlots || [];
  }

  async cancelBooking(id: string, reason?: string): Promise<CourtBooking> {
    const response = await api.patch(`/booking/${id}/cancel`, { reason });
    return response.data.booking;
  }

  async getAllBookings(params?: {
    status?: string;
    date?: string;
    facilityId?: string;
  }): Promise<CourtBooking[]> {
    const response = await api.get("/booking", { params });
    return response.data.bookings || [];
  }

  async updateBooking(
    id: string,
    data: Partial<CourtBooking>,
  ): Promise<CourtBooking> {
    const response = await api.patch(`/booking/${id}`, data);
    return response.data.booking;
  }

  async checkin(id: string): Promise<CourtBooking> {
    const response = await api.patch(`/booking/${id}/checkin`);
    return response.data.booking;
  }

  async checkout(id: string): Promise<CourtBooking> {
    const response = await api.patch(`/booking/${id}/checkout`);
    return response.data.booking;
  }

  // ==================== ADMIN TIME SLOT MANAGEMENT ====================

  // Lấy danh sách sân từ bookings
  async getUniqueFacilities(): Promise<{ id: string; name: string; location: string }[]> {
    const response = await api.get("/booking/admin/facilities");
    return response.data.facilities;
  }

  // Lấy danh sách khung giờ theo ngày
  async getTimeSlotsForDay(facilityId: string, date: string): Promise<TimeSlot[]> {
    const response = await api.get("/booking/admin/time-slots", {
      params: { facilityId, date },
    });
    return response.data.slots;
  }

  // Lấy thống kê khung giờ
  async getTimeSlotStats(facilityId: string, date: string): Promise<TimeSlotStats> {
    const response = await api.get("/booking/admin/time-slots/stats", {
      params: { facilityId, date },
    });
    return response.data.stats;
  }

  // Khóa khung giờ
  async lockTimeSlot(facilityId: string, date: string, timeSlot: string, reason?: string): Promise<{ booking: CourtBooking }> {
    const response = await api.post("/booking/admin/time-slots/lock", {
      facilityId,
      date,
      timeSlot,
      reason,
    });
    return response.data;
  }

  // Mở khóa khung giờ
  async unlockTimeSlot(facilityId: string, date: string, timeSlot: string): Promise<{ message: string }> {
    const response = await api.post("/booking/admin/time-slots/unlock", {
      facilityId,
      date,
      timeSlot,
    });
    return response.data;
  }

  // Cập nhật giá khung giờ
  async updateSlotPrice(bookingId: string, newPrice: number): Promise<CourtBooking> {
    const response = await api.patch(`/booking/admin/time-slots/${bookingId}/price`, {
      newPrice,
    });
    return response.data;
  }

  // Khóa nhiều khung giờ cùng lúc
  async lockMultipleSlots(facilityId: string, date: string, timeSlots: string[], reason?: string): Promise<LockMultipleResult[]> {
    const response = await api.post("/booking/admin/time-slots/lock-multiple", {
      facilityId,
      date,
      timeSlots,
      reason,
    });
    return response.data.results;
  }

  // Lấy khung giờ theo tuần
  async getTimeSlotsForWeek(facilityId: string, startDate: string): Promise<WeekSlotStats[]> {
    const response = await api.get("/booking/admin/time-slots/week", {
      params: { facilityId, startDate },
    });
    return response.data.slots || [];
  }

  // Lấy khung giờ theo tháng
  async getTimeSlotsForMonth(facilityId: string, year: number, month: number): Promise<MonthSlotStats[]> {
    const response = await api.get("/booking/admin/time-slots/month", {
      params: { facilityId, year, month },
    });
    return response.data.slots || [];
  }

  // Admin: Get booking stats
  async getBookingStats(): Promise<{
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    totalRevenue: number;
  }> {
    const response = await api.get('/admin/booking-stats');
    return response.data.stats;
  }

  // Admin: Get all bookings with filters
  async getAdminBookings(params?: {
    status?: string;
    date?: string;
    facilityId?: string;
  }): Promise<CourtBooking[]> {
    const response = await api.get('/booking', { params });
    console.log("📡 Dữ liệu Booking từ Backend:", response.data);
    return response.data.bookings || [];
  }

  // Admin: Update booking
  async adminUpdateBooking(
    id: string,
    data: Partial<CourtBooking>
  ): Promise<CourtBooking> {
    const response = await api.patch(`/admin/bookings/${id}`, data);
    return response.data.booking;
  }

  // Admin: Cancel booking
  async adminCancelBooking(id: string, reason?: string): Promise<CourtBooking> {
    const response = await api.patch(`/admin/bookings/${id}/cancel`, { reason });
    return response.data.booking;
  }

  // Admin: Check-in booking
  async adminCheckinBooking(id: string): Promise<CourtBooking> {
    const response = await api.patch(`/admin/bookings/${id}/checkin`);
    return response.data.booking;
  }
}

const bookingService = new BookingService();
export default bookingService;
