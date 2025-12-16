# Kiến trúc Module Booking (Mô hình gộp)

Tài liệu này mô tả kiến trúc và luồng sự kiện của module Booking, được thiết kế để xử lý việc đặt nhiều khung giờ trong một giao dịch duy nhất.

## 🚀 Tổng quan

Quy trình đặt sân được thiết kế lại để gộp khái niệm "Đơn hàng" (Order) vào một `Booking` duy nhất. Một document `Booking` bây giờ có thể chứa thông tin của một hoặc nhiều khung giờ. Luồng xử lý cốt lõi bao gồm ba giai đoạn chính:

1.  **Khởi tạo Booking (chứa nhiều khung giờ)**: Người dùng chọn nhiều khung giờ, hệ thống tạo ra một đơn `Booking` tạm thời duy nhất.
2.  **Xử lý Thanh toán**: Người dùng được chuyển hướng đến cổng thanh toán để thanh toán cho toàn bộ `Booking`.
3.  **Xác nhận/Hủy bỏ**: Hệ thống xử lý kết quả thanh toán để xác nhận hoặc hủy bỏ đơn `Booking`.

## 🧠 Phân tích Luồng sự kiện

### Giai đoạn 1: Tạo Booking và Chuyển hướng Thanh toán (`POST /booking`)

1.  **Yêu cầu (Request)**: Client gửi một yêu cầu `POST` đến `/api/booking` với payload là `CreateBookingDto`, trong đó chứa một mảng các khung giờ (`slots`).
2.  **Kiểm tra Trùng lịch (Conflict Check)**: `BookingService` xây dựng một câu lệnh truy vấn phức tạp để kiểm tra xem **bất kỳ** khung giờ nào được yêu cầu có chồng chéo với **bất kỳ** khung giờ nào trong các `Booking` đã tồn tại (ở trạng thái chiếm sân) hay không.
    - Nếu tìm thấy trùng lặp, một `ConflictException (409)` sẽ được ném ra.
3.  **Tạo Booking Tạm thời**: Nếu tất cả các khung giờ đều hợp lệ, một document `Booking` **duy nhất** sẽ được tạo với:
    *   Một mảng `slots` chứa tất cả các khung giờ đã chọn.
    *   `totalPrice` được tính bằng tổng giá của các slot.
    *   Trạng thái được mặc định là `PENDING_PAYMENT`.
4.  **Tạo Link Thanh toán**: `BookingService` gọi `PaymentService.createPayment()` với `bookingId` của đơn hàng vừa tạo.
5.  **Phản hồi (Response)**: Controller trả về một đối tượng JSON chứa `bookingId` và `paymentUrl` cho client.

### Giai đoạn 2: Xử lý Callback Thanh toán (`GET /booking/callback`)

Endpoint này được cổng thanh toán gọi để thông báo kết quả giao dịch.

1.  **Yêu cầu (Request)**: Cổng thanh toán thực hiện yêu cầu `GET` đến `/api/booking/callback` với `bookingId` và `status`.
2.  **Service Xử lý**: `BookingController` gọi `BookingService.handlePaymentCallback()`.
3.  **Cập nhật Trạng thái**:
    -   **Khi thành công (`status=success`)**: Trạng thái của `Booking` được cập nhật từ `PENDING_PAYMENT` thành **`CONFIRMED`**.
    -   **Khi thất bại (`status=failed`)**: Trạng thái của `Booking` được cập nhật từ `PENDING_PAYMENT` thành **`FAILED`**.
4.  **Thông báo và Chuyển hướng**: Gửi thông báo và chuyển hướng người dùng về frontend.

### Giai đoạn 3: Xử lý các Booking chờ Thanh toán Quá hạn

Cơ chế này đảm bảo các khung giờ không bị giữ vô thời hạn.
-   **Cơ chế**: Một **Cron Job** chạy mỗi phút trong `BookingService`.
-   **Logic**: Tìm tất cả các `Booking` có `status: 'PENDING_PAYMENT'` đã được tạo quá 5 phút.
-   **Hành động**: Cập nhật trạng thái của chúng thành `EXPIRED` (chưa hiện thực hóa trong schema). *Ghi chú: Hiện tại Schema đang dùng TTL Index để xóa thay vì cập nhật.*

## ⚙️ Các Thành phần Chính

-   `BookingController`: Quản lý các endpoint HTTP cho booking.
-   `BookingService`: Chứa tất cả logic nghiệp vụ cốt lõi, bao gồm kiểm tra trùng lịch, tạo booking, xử lý callback, và hủy đơn.
-   `BookingSchema`: Định nghĩa cấu trúc dữ liệu cho một `Booking` (có thể chứa nhiều slot).
-   `PaymentService`: Tích hợp với cổng thanh toán để tạo link và xử lý kết quả.
-   `NotificationService (Mock)`: Giả lập việc gửi thông báo.
