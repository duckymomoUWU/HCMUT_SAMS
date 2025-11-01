// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    GOOGLE: '/auth/google',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_OTP: '/auth/verify-otp',
  },
  
  // User
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
    CHANGE_PASSWORD: '/user/change-password',
  },
  
  // Booking
  BOOKING: {
    LIST: '/booking',
    CREATE: '/booking',
    DETAIL: (id: string) => `/booking/${id}`,
    UPDATE: (id: string) => `/booking/${id}`,
    DELETE: (id: string) => `/booking/${id}`,
    CANCEL: (id: string) => `/booking/${id}/cancel`,
    HISTORY: '/booking/history',
  },
  
  // Facility
  FACILITY: {
    LIST: '/facility',
    DETAIL: (id: string) => `/facility/${id}`,
    AVAILABLE: '/facility/available',
  },
  
  // Equipment
  EQUIPMENT: {
    LIST: '/equipment',
    DETAIL: (id: string) => `/equipment/${id}`,
    AVAILABLE: '/equipment/available',
  },
  
  // Payment
  PAYMENT: {
    CREATE: '/payment',
    VERIFY: '/payment/verify',
    HISTORY: '/payment/history',
  },
  
  // Check-in
  CHECKIN: {
    CREATE: '/checkin',
    VERIFY: '/checkin/verify',
    HISTORY: '/checkin/history',
  },
  
  // Admin
  ADMIN: {
    USERS: '/admin/users',
    FACILITIES: '/admin/facilities',
    EQUIPMENT: '/admin/equipment',
    BOOKINGS: '/admin/bookings',
    STATISTICS: '/admin/statistics',
  },
} as const;
