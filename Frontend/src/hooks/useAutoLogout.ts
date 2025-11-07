import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { isTokenValid, getTokenRemainingTime } from '../utils/jwt';

/**
 * Hook tự động logout khi token hết hạn
 * @param warningBeforeExpiry - Thời gian cảnh báo trước khi token hết hạn (milliseconds) - Mặc định 5 phút
 * @param checkInterval - Khoảng thời gian kiểm tra token (milliseconds) - Mặc định 1 phút
 */
export const useAutoLogout = (
  warningBeforeExpiry: number = 5 * 60 * 1000, // 5 phút
  checkInterval: number = 60 * 1000 // 1 phút
) => {
  const navigate = useNavigate();
  const warningShownRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Hàm xử lý logout
  const handleLogout = useCallback((message: string) => {
    // Xóa interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Hiển thị thông báo
    alert(message);

    // Logout và chuyển về trang login
    authService.logout();
    navigate('/login', { replace: true });
  }, [navigate]);

  // Hàm hiển thị cảnh báo trước khi hết hạn
  const showExpiryWarning = useCallback((minutesRemaining: number) => {
    const message = `⏰ Token đăng nhập sẽ hết hạn trong ${minutesRemaining} phút.\n\nBạn có muốn gia hạn token không?`;

    const shouldRefresh = confirm(message);

    if (shouldRefresh) {
      // Gọi refresh token để gia hạn
      authService.refreshAccessToken()
        .then(() => {
          alert('✅ Token đã được gia hạn thành công!');
          warningShownRef.current = false; // Reset để có thể cảnh báo lại
        })
        .catch((error) => {
          console.error('❌ Refresh token failed:', error);
          handleLogout('Không thể gia hạn token. Vui lòng đăng nhập lại.');
        });
    }
  }, [handleLogout]);

  useEffect(() => {
    // Hàm kiểm tra token
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('accessToken');

      // Nếu không có token → Logout ngay
      if (!token) {
        handleLogout('Token không tồn tại');
        return;
      }

      // Kiểm tra token có hợp lệ không
      if (!isTokenValid(token)) {
        handleLogout('Token đã hết hạn');
        return;
      }

      // Lấy thời gian còn lại (milliseconds)
      const remainingTime = getTokenRemainingTime(token);

      // Token đã hết hạn
      if (remainingTime <= 0) {
        handleLogout('Token đã hết hạn');
      } 
      // Token sắp hết hạn (còn ít hơn warningBeforeExpiry)
      else if (remainingTime <= warningBeforeExpiry && !warningShownRef.current) {
        const minutesRemaining = Math.floor(remainingTime / 1000 / 60);
        showExpiryWarning(minutesRemaining);
        warningShownRef.current = true;
      } 
      // Token còn nhiều thời gian → Reset cảnh báo
      else if (remainingTime > warningBeforeExpiry) {
        warningShownRef.current = false;
      }
    };

    // Kiểm tra ngay lập tức khi component mount
    checkTokenExpiration();

    // Thiết lập interval để kiểm tra định kỳ
    intervalRef.current = setInterval(checkTokenExpiration, checkInterval);

    // Cleanup khi component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [warningBeforeExpiry, checkInterval, handleLogout, showExpiryWarning]);
};