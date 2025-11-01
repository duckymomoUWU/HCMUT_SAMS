// Route constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_OTP: '/verify-otp',
  
  // Dashboard
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
  
  // Booking
  BOOKING: '/booking',
  BOOKING_HISTORY: '/booking/history',
  BOOKING_DETAIL: '/booking/:id',
  
  // Payment
  PAYMENT: '/payment',
  PAYMENT_SUCCESS: '/payment/success',
  PAYMENT_FAILED: '/payment/failed',
  
  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_FACILITIES: '/admin/facilities',
  ADMIN_EQUIPMENT: '/admin/equipment',
  ADMIN_BOOKINGS: '/admin/bookings',
  
  // Check-in
  CHECKIN: '/checkin',
  CHECKIN_HISTORY: '/checkin/history',
  
  // Other
  NOT_FOUND: '*',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
