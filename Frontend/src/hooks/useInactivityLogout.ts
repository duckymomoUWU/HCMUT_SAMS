import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

/**
 * Hook tự động logout sau khoảng thời gian không hoạt động
 * @param inactivityTimeout - Thời gian không hoạt động trước khi logout (milliseconds) - Mặc định 15 phút
 */
export const useInactivityLogout = (
  inactivityTimeout: number = 15 * 60 * 1000 // 15 phút
) => {
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Hàm logout
  const handleLogout = useCallback(() => {
    console.log('⏰ Auto logout do không hoạt động');
    authService.logout();
    navigate('/login', { replace: true });
  }, [navigate]);

  // Hàm reset timer
  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();

    // Xóa timeout cũ
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Tạo timeout mới
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, inactivityTimeout);
  }, [inactivityTimeout, handleLogout]);

  useEffect(() => {
    // Danh sách events để theo dõi hoạt động của user
    const events = [
      'mousedown',    // Click chuột
      'mousemove',    // Di chuyển chuột
      'keydown',      // Nhấn phím
      'scroll',       // Scroll trang
      'touchstart',   // Touch trên mobile
      'click',        // Click
    ];

    // Reset timer khi user có hoạt động
    const handleActivity = () => {
      resetTimer();
    };

    // Đăng ký event listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Khởi tạo timer lần đầu
    resetTimer();

    // Cleanup khi unmount
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer]);

  // KHÔNG xóa token khi user đóng tab/tắt browser
  // Token vẫn được giữ trong localStorage để user có thể quay lại
};
