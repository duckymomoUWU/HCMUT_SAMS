import api from "@/lib/Axios";

export interface CourtBooking {
  _id: string;
  userId: string;
  facilityId: string;
  facilityName: string;
  facilityLocation: string;
  date: string;
  timeSlot: string;
  startTime: string;
  endTime: string;
  price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
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
  // Tạo booking mới
  async createBooking(data: CreateBookingDTO): Promise<{ booking: CourtBooking }> {
    const response = await api.post("/booking", data);
    return response.data;
  }

  // Lấy booking của user hiện tại
  async getMyBookings(): Promise<CourtBooking[]> {
    const response = await api.get("/booking/my-bookings");
    return response.data.bookings;
  }

  // Lấy booking theo ID
  async getBookingById(id: string): Promise<CourtBooking> {
    const response = await api.get(`/booking/${id}`);
    return response.data.booking;
  }

  // Lấy các slot đã đặt
  async getBookedSlots(facilityId: string, date: string): Promise<string[]> {
    const response = await api.get("/booking/booked-slots", {
      params: { facilityId, date },
    });
    return response.data.bookedSlots;
  }

  // Hủy booking
  async cancelBooking(id: string, reason?: string): Promise<CourtBooking> {
    const response = await api.patch(`/booking/${id}/cancel`, { reason });
    return response.data.booking;
  }

  // Admin: Lấy tất cả booking
  async getAllBookings(params?: {
    status?: string;
    date?: string;
    facilityId?: string;
  }): Promise<CourtBooking[]> {
    const response = await api.get("/booking", { params });
    return response.data.bookings;
  }

  // Admin: Cập nhật booking
  async updateBooking(
    id: string,
    data: Partial<CourtBooking>
  ): Promise<CourtBooking> {
    const response = await api.patch(`/booking/${id}`, data);
    return response.data.booking;
  }

  // Staff: Check-in
  async checkin(id: string): Promise<CourtBooking> {
    const response = await api.patch(`/booking/${id}/checkin`);
    return response.data.booking;
  }

  // Staff: Check-out
  async checkout(id: string): Promise<CourtBooking> {
    const response = await api.patch(`/booking/${id}/checkout`);
    return response.data.booking;
  }
}

const bookingService = new BookingService();
export default bookingService;
