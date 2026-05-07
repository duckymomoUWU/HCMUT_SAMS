<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version 1.0.0" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
</div>

<br />

<div align="center">
  <h1>🏟️ HCMUT SAMS</h1>
  <p><strong>S</strong>ports <strong>A</strong>rena <strong>M</strong>anagement <strong>S</strong>ystem</p>
  <p><em>Hệ thống quản lý sân bãi & thiết bị thể thao trường Đại học Bách Khoa TP.HCM</em></p>
</div>

<br />

---

## 📋 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Cài đặt & Chạy dự án](#-cài-đặt--chạy-dự-án)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [API Endpoints](#-api-endpoints)
- [Tài khoản mặc định](#-tài-khoản-mặc-định)
- [Hướng dẫn thanh toán thử nghiệm](#-hướng-dẫn-thanh-toán-thử-nghiệm)
- [Đóng góp](#-đóng-góp)
- [Giấy phép](#-giấy-phép)

---

## 🎯 Giới thiệu

**HCMUT SAMS** là hệ thống quản lý sân bãi và thiết bị thể thao dành cho sinh viên và cán bộ trường Đại học Bách Khoa TP.HCM. Hệ thống cho phép người dùng:

- 📅 **Đặt sân thể thao** (bóng đá, bóng rổ, cầu lông,...) theo khung giờ linh hoạt
- 🏸 **Thuê thiết bị thể thao** kèm theo sân
- 💳 **Thanh toán trực tuyến** qua cổng VNPay
- 👨‍💼 **Quản lý tập trung** cho admin với dashboard thống kê trực quan

---

## ✨ Tính năng

### 🔐 Hệ thống xác thực & bảo mật

| Tính năng | Mô tả |
|-----------|-------|
| Đăng ký tài khoản | Xác thực email qua OTP 6 số |
| Đăng nhập | JWT Access Token + Refresh Token |
| Đăng nhập Google | OAuth 2.0 với Google |
| Quên mật khẩu | Reset mật khẩu qua OTP email |
| Phân quyền | Role-based: `student` & `admin` |

### 👨‍🎓 Dành cho sinh viên (Client)

- **Đặt sân**: Chọn sân, ngày, khung giờ (07:00 - 22:00, 14 khung/ngày)
- **Thuê thiết bị**: Thuê vợt, bóng, lưới,... theo giờ
- **Lịch sử đặt sân**: Xem lại các booking đã đặt
- **Lịch sử thuê thiết bị**: Theo dõi thiết bị đã thuê
- **Hồ sơ cá nhân**: Cập nhật thông tin, đổi mật khẩu
- **Thanh toán**: Thanh toán trực tuyến qua VNPay

### 👨‍💼 Dành cho quản trị viên (Admin)

- **Dashboard thống kê**: Biểu đồ, số liệu tổng quan
- **Quản lý người dùng**: Xem, khóa, xóa tài khoản
- **Quản lý sân bãi**: Thêm, sửa, xóa sân
- **Quản lý thiết bị**: Quản lý danh mục & từng thiết bị cụ thể
- **Quản lý đơn hàng**: Xác nhận, hủy, check-in booking
- **Quản lý khung giờ**: Xem thống kê khung giờ theo ngày/sân
- **Check-in/Check-out**: Xác nhận sinh viên đã đến sân

---

## 🛠 Công nghệ sử dụng

### Backend

| Công nghệ | Mục đích |
|-----------|----------|
| [NestJS](https://nestjs.com/) 11 | Framework Node.js server-side |
| [MongoDB](https://www.mongodb.com/) | Cơ sở dữ liệu NoSQL |
| [Mongoose](https://mongoosejs.com/) 8 | ODM cho MongoDB |
| [Passport.js](http://www.passportjs.org/) | Xác thực (JWT + Google OAuth) |
| [JWT](https://jwt.io/) | Access & Refresh Token |
| [Nodemailer](https://nodemailer.com/) | Gửi email OTP |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js) | Mã hóa mật khẩu |
| [class-validator](https://github.com/typestack/class-validator) | Validation DTO |

### Frontend

| Công nghệ | Mục đích |
|-----------|----------|
| [React](https://react.dev/) 19 | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Vite](https://vitejs.dev/) | Build tool |
| [Tailwind CSS](https://tailwindcss.com/) 4 | Utility-first CSS |
| [Redux Toolkit](https://redux-toolkit.js.org/) | State management |
| [React Router](https://reactrouter.com/) 7 | Routing |
| [Axios](https://axios-http.com/) | HTTP client + Interceptors |
| [Recharts](https://recharts.org/) | Biểu đồ thống kê |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Sonner](https://sonner.emilkowal.ski/) | Toast notifications |
| [jsPDF](https://github.com/parallax/jsPDF) | Xuất PDF |

---

## 🏗 Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React + Vite)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │   Pages   │  │    UI    │  │   Store  │  │  Services  │  │
│  │ (Routing) │  │(Tailwind)│  │  (Redux) │  │  (Axios)   │  │
│  └──────────┘  └──────────┘  └──────────┘  └─────┬──────┘  │
│                                                   │         │
└───────────────────────────────────────────────────┼─────────┘
                                                    │
                                              HTTP/JSON
                                                    │
┌───────────────────────────────────────────────────┼─────────┐
│                      Backend (NestJS)              │         │
│  ┌────────────────────────────────────────────────┐│         │
│  │              Controllers Layer                  ││         │
│  │  Auth │ Booking │ Facility │ Equipment │ ...   ││         │
│  └───────────────────┬────────────────────────────┘│         │
│                      │                              │         │
│  ┌───────────────────▼────────────────────────────┐│         │
│  │              Services Layer                     ││         │
│  │  Business Logic │ Validation │ Authorization   ││         │
│  └───────────────────┬────────────────────────────┘│         │
│                      │                              │         │
│  ┌───────────────────▼────────────────────────────┐│         │
│  │              Data Access Layer                  ││         │
│  │          Mongoose Models & Schemas             ││         │
│  └───────────────────┬────────────────────────────┘│         │
│                      │                              │         │
└──────────────────────┼──────────────────────────────┘         │
                       │                                        │
                ┌──────▼──────┐                                 │
                │   MongoDB   │                                 │
                │  (Atlas)    │                                 │
                └─────────────┘                                 │
```

---

## 🚀 Cài đặt & Chạy dự án

### Yêu cầu

- [Node.js](https://nodejs.org/) >= 22
- [npm](https://www.npmjs.com/) >= 10
- [MongoDB](https://www.mongodb.com/) (local hoặc Atlas)

### 1. Clone dự án

```bash
git clone https://github.com/duckymomoUWU/HCMUT_SAMS.git
cd HCMUT_SAMS
```

### 2. Cấu hình Backend

```bash
cd Backend

# Cài đặt dependencies
npm install

# Tạo file .env (tham khảo .env.example)
# ⚠️ Bắt buộc phải có các biến môi trường:
#   - MONGODB_URI: MongoDB connection string
#   - JWT_SECRET: Secret key cho JWT
#   - EMAIL_USER & EMAIL_PASSWORD: Gmail SMTP (gửi OTP)
#   - VNPAY_TMN_CODE & VNPAY_HASH_SECRET: VNPay merchant keys
#   - GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET: Google OAuth

# Chạy seed tài khoản admin
npm run seed:admin

# Khởi động server (development)
npm run start:dev
```

Backend sẽ chạy tại **http://localhost:5000**.

### 3. Cấu hình Frontend

```bash
cd Frontend

# Cài đặt dependencies
npm install

# Khởi động development server
npm run dev
```

Frontend sẽ chạy tại **http://localhost:5173**.

### 4. Build cho production

```bash
# Backend
cd Backend && npm run build && npm run start:prod

# Frontend
cd Frontend && npm run build
```

### Deploy Frontend lên GitHub Pages

```bash
cd Frontend
npm run deploy
```

---

## 📁 Cấu trúc thư mục

```
HCMUT_SAMS/
├── Backend/                          # NestJS Backend
│   ├── src/
│   │   ├── main.ts                   # Entry point
│   │   ├── app.module.ts             # Root module
│   │   ├── common/                   # Shared resources
│   │   │   ├── decorators/           # @Public(), @Roles()
│   │   │   ├── guards/               # JWT Auth, Roles guards
│   │   │   └── interceptors/         # Interceptors
│   │   └── modules/
│   │       ├── auth/                 # Auth (login, register, OTP, Google OAuth)
│   │       ├── users/                # User profile, dashboard stats
│   │       ├── admin/                # Admin dashboard & management
│   │       ├── booking/              # Sân booking
│   │       ├── facility/             # Quản lý sân bãi
│   │       ├── equipment/            # Danh mục thiết bị
│   │       ├── equipment-item/       # Thiết bị chi tiết (theo dõi từng cái)
│   │       ├── equipment-rental/     # Thuê thiết bị
│   │       ├── payment/              # Thanh toán VNPay
│   │       ├── checkin/              # Check-in/Check-out
│   │       ├── notification/         # Thông báo email
│   │       └── history/              # Lịch sử hoạt động
│   ├── test/                         # E2E tests
│   └── scripts/                      # Seed scripts
│
└── Frontend/                         # React + Vite Frontend
    └── src/
        ├── App.tsx                   # Root component
        ├── main.tsx                  # Entry point
        ├── components/               # Shared components
        │   ├── ui/                   # UI primitives (shadcn-style)
        │   ├── layout/               # Admin & Client layouts
        │   ├── MainPage/             # Landing page sections
        │   └── common/               # Common components
        ├── pages/
        │   ├── Auth/                 # Login, Register, Verify OTP
        │   ├── Client/               # Booking, Equipment Rental, Profile
        │   ├── Admin/                # Dashboard, Users, Devices, Orders
        │   └── Payment/              # Payment result
        ├── services/                 # API service layer (Axios)
        ├── store/                    # Redux store & slices
        ├── hooks/                    # Custom hooks
        ├── routes/                   # App routing & guards
        ├── constants/                # Routes, API endpoints
        ├── types/                    # TypeScript type definitions
        └── utils/                    # Utility functions
```

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/auth/register` | Đăng ký (gửi OTP email) | ❌ |
| POST | `/auth/verify-otp` | Xác thực OTP | ❌ |
| POST | `/auth/resend-otp` | Gửi lại OTP | ❌ |
| POST | `/auth/login` | Đăng nhập | ❌ |
| POST | `/auth/refresh` | Refresh token | ❌ |
| POST | `/auth/forgot-password` | Quên mật khẩu | ❌ |
| POST | `/auth/reset-password` | Đặt lại mật khẩu | ❌ |
| GET | `/auth/google` | Đăng nhập Google | ❌ |
| GET | `/auth/google/callback` | Google OAuth callback | ❌ |

### 👤 Users

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/users` | Danh sách user | ❌ |
| GET | `/users/profile` | Thông tin cá nhân | ✅ |
| PUT | `/users/profile` | Cập nhật thông tin | ✅ |
| GET | `/users/dashboard` | Thống kê dashboard | ✅ |

### 📅 Booking

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/booking` | Tạo booking mới | ✅ |
| GET | `/booking/my-bookings` | Booking của tôi | ✅ |
| GET | `/booking/booked-slots` | Slot đã đặt (theo sân + ngày) | ✅ |
| GET | `/booking/admin/facilities` | [Admin] DS sân | ✅ |
| GET | `/booking/admin/time-slots` | [Admin] Khung giờ | ✅ |

### 🏸 Thiết bị

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET/POST | `/equipment` | CRUD danh mục thiết bị |
| GET/POST | `/equipment-items` | CRUD thiết bị chi tiết |
| GET | `/equipment-items/grouped` | Thiết bị nhóm theo loại |
| POST | `/equipment-rental` | Thuê thiết bị |
| GET | `/equipment-rental/my-rentals` | Lịch sử thuê |

### 💳 Payment

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/payment` | Tạo payment + URL VNPay | ✅ |
| GET | `/payment/vnpay-return` | VNPay callback | ❌ |
| GET | `/payment/:id` | Chi tiết payment | ✅ |
| GET | `/payment/user/me` | DS payment của user | ✅ |

### 👨‍💼 Admin

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/admin/booking-stats` | Thống kê booking |
| GET | `/admin/bookings` | DS booking |
| PATCH | `/admin/bookings/:id` | Cập nhật booking |
| PATCH | `/admin/bookings/:id/cancel` | Hủy booking |
| PATCH | `/admin/bookings/:id/checkin` | Check-in |
| GET | `/admin/rentals` | DS thuê thiết bị |
| PATCH | `/admin/rentals/:id/status` | Cập nhật trạng thái thuê |

---

## 👤 Tài khoản mặc định

### Quản trị viên

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| 🛡️ Admin | `admin@hcmut.edu.vn` | `Admin@123456` |

> ⚠️ Chạy lệnh `npm run seed:admin` ở Backend để tạo tài khoản admin mặc định.

---

## 💳 Hướng dẫn thanh toán thử nghiệm

Hệ thống tích hợp cổng thanh toán **VNPay Sandbox**. Sử dụng thông tin thẻ test sau:

| Thông tin | Giá trị |
|-----------|---------|
| 🏦 Ngân hàng | **NCB** |
| 💳 Số thẻ | `9704 1985 2619 1432 198` |
| 👤 Tên chủ thẻ | `NGUYEN VAN A` |
| 📅 Ngày phát hành | `07/15` |
| 🔐 Mã OTP | `123456` |

---

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng:

1. Fork dự án
2. Tạo branch feature mới: `git checkout -b feature/amazing-feature`
3. Commit thay đổi: `git commit -m 'Add amazing feature'`
4. Push lên branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

---

## 📄 Giấy phép

Dự án được phân phối dưới giấy phép **MIT**. Xem file `LICENSE` để biết thêm chi tiết.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/duckymomoUWU">duckymomoUWU</a></p>
  <p>Trường Đại học Bách Khoa TP.HCM - HCMUT</p>
</div>
