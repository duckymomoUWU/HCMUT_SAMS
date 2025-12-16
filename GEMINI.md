# 📂 PHÂN TÍCH VÀ ĐÁNH GIÁ KIẾN TRÚC DỰ ÁN HCMUT_SAMS

Tài liệu này tổng hợp phân tích cấu trúc dự án (Backend NestJS và Frontend React/TS) nhằm giúp các lập trình viên mới/thành viên dự án nhanh chóng hiểu được mô hình kiến trúc và các quy ước codebase.

## 1. 🌐 BACKEND (NESTJS) – ĐÁNH GIÁ CHUYÊN SÂU

### 1.1. Kiến trúc Tổng thể

Kiến trúc Backend tuân thủ nghiêm ngặt **chuẩn NestJS Modular**, tách biệt rõ ràng các trách nhiệm theo mô hình Multi-Layered Architecture:

* **Controller:** Xử lý routing và nhận Request.
* **Service:** Chứa Logic Nghiệp vụ (Business Logic) cốt lõi.
* **DTO (Data Transfer Object):** Xử lý Input Validation và định hình dữ liệu truyền qua các tầng.
* **Entity / Schema:** Định nghĩa cấu trúc dữ liệu cho Database (MongoDB/Mongoose).

### 1.2. Thư mục và Vai trò Chính

| Thư mục/Thành phần | Vai trò Chính | Mức độ Ưu tiên |
| :--- | :--- | :--- |
| **common/decorators** | Định nghĩa các Decorator tùy chỉnh như `@Public()` (bỏ qua AuthGuard) và `@Roles()` (phân quyền). | Cao |
| **common/guards** | Triển khai **RBAC** (Role-Based Access Control) thông qua `jwt-auth.guard.ts` và `roles.guard.ts`. | Cao |
| **modules/** | Chứa toàn bộ các Module nghiệp vụ (ví dụ: `auth`, `booking`, `admin`). | Rất Cao |
| **schemas/ + entities/** | Chứa các mô hình dữ liệu (Có dấu hiệu dùng Mongoose). **Gợi ý cải thiện:** Nên thống nhất sử dụng `Entity` hoặc `Schema`. | Trung bình |
| **seed-admin.ts** | Script khởi tạo dữ liệu quản trị viên ban đầu. | Cao |

### 1.3. Module Nghiệp vụ Cốt lõi (`modules/`)

Thiết kế module rất đúng với yêu cầu của hệ thống quản lý cơ sở thể thao:

| Module | Chức năng Chính | Mô hình Tương tác |
| :--- | :--- | :--- |
| `auth` | Đăng nhập Google OAuth, JWT Generation/Validation, Email HCMUT. | Controller $\rightarrow$ Service |
| `booking` | Logic Đặt/Hủy/Sửa sân (UC-04, UC-05). | Service $\rightarrow$ Payment/Penalty-History |
| `payment` | Xử lý tích hợp cổng thanh toán, callback và hoàn tiền. | Service $\rightarrow$ Notification |
| `penalty-history` | Lưu trữ lịch sử phạt, tính điểm vi phạm (UC-05). | Service $\rightarrow$ Database |
| `admin` | Quản lý người dùng, thiết bị, cơ sở vật chất. | Guard $\rightarrow$ Controller |

## 2. ⚛️ FRONTEND (REACT + TYPESCRIPT) – ĐÁNH GIÁ CODEBASE

### 2.1. Tổng thể & Layering

Frontend là ứng dụng React + TS, sử dụng **Redux (authSlice)** để quản lý trạng thái xác thực và **Axios Instance** để xử lý giao tiếp API. Cấu trúc chia rõ ràng giữa Admin và Client, sử dụng `ProtectedRoute` đảm bảo chỉ người dùng có Token hợp lệ mới truy cập được.

### 2.2. Thư mục và Vai trò Chính

| Thư mục | Vai trò Chính | Tầm quan trọng |
| :--- | :--- | :--- |
| **pages/** | Chứa các màn hình (routes) chính. Tách biệt rõ ràng: `Admin`, `Client`, `Auth`. | Cao (Tổ chức Route) |
| **services/** | **Service Layer** của Frontend. Chứa `api.ts` (Axios instance) và `authService.ts`. **Quy tắc:** Component KHÔNG gọi API trực tiếp. | Rất Cao (Tách biệt logic) |
| **hooks/** | Chứa các hook phức tạp như `useAuth`, `useAutoLogout`, `useInactivityLogout`. Đảm bảo logic bảo mật/phiên làm việc. | Cao (Bảo mật/UX) |
| **components/** | Phân tách UI theo khu vực (`Admin/`, `Client/`, `ui/`) $\rightarrow$ Tái sử dụng cao. | Trung bình |

## 3. 🗺️ MAPPING VÀ NHẬN XÉT TỔNG QUAN

### 3.1. Sự đồng bộ Backend ↔ Frontend

Sự đồng bộ 1-1 giữa các module Backend và các trang Frontend là một điểm mạnh lớn:

| Backend Module | Frontend Page/Area |
| :--- | :--- |
| `auth` | `Auth/*`, `GoogleLogin` |
| `booking` | `Client/Booking`, `BookingHistory` |
| `equipment` | `EquipmentRental` |
| `admin` | `Admin/*` (Dashboard, Users, Devices) |

### 3.2. Điểm mạnh Chính (Best Practices)

1.  **Kiến trúc Chuẩn:** Áp dụng mô hình Modular NestJS và Service Layer Frontend.
2.  **Bảo mật:** Triển khai **RBAC** và logic quản lý phiên (`useAutoLogout`).
3.  **Khả năng Mở rộng:** Codebase rõ ràng, dễ dàng thêm module mới (ví dụ: `review`, `report`).

### 3.3. Các điểm có thể Cải thiện (Technical Debt)

1.  **Quy ước DB:** Cần thống nhất sử dụng `entity` hay `schema` cho các mô hình dữ liệu.
2.  **Tài liệu:** Thêm các file `README.md`/`CONTRIBUTING.md` mô tả chi tiết flow.
3.  **Độ nghiêm ngặt:** Tách các Interface ra khỏi DTO để tăng tính nghiêm ngặt cho Backend DTO.
4.  **Tùy chỉnh AI:** **Tạo các file `GEMINI.md`** trong thư mục gốc và các module phức tạp để cung cấp ngữ cảnh kiến trúc cho Gemini Code Assist, tối ưu hóa sự hỗ trợ của AI.