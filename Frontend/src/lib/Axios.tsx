import axios from "axios";
import { store } from "@/store/Store";
import { setAccessToken, clearState } from "@/store/authSlice";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : "/api",
  withCredentials: true,
});

// Gắn access token vào request header
api.interceptors.request.use((config) => {
  const state = store.getState();
  // Ưu tiên lấy token từ Redux store, nếu không có thì lấy từ localStorage
  const accessToken = state.auth.accessToken || localStorage.getItem("accessToken");

  console.log("🔐 Access Token:", accessToken ? "Found" : "NOT FOUND");
  console.log("🔐 Token source:", state.auth.accessToken ? "Redux" : (localStorage.getItem("accessToken") ? "localStorage" : "None"));

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Tự động gọi refresh token khi access token hết hạn
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url.includes("/auth/signin") ||
      originalRequest.url.includes("/auth/signup") ||
      originalRequest.url.includes("/auth/refresh") ||
      originalRequest.url.includes("/auth/login")
    ) {
      return Promise.reject(error);
    }

    (originalRequest as any)._retryCount =
      (originalRequest as any)._retryCount || 0;

    // Handle both 401 and 403 for token refresh
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      (originalRequest as any)._retryCount < 4
    ) {
      (originalRequest as any)._retryCount += 1;

      try {
        // Lấy refreshToken từ localStorage
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!refreshToken) {
          console.log("❌ No refresh token found in localStorage");
          store.dispatch(clearState());
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          return Promise.reject(error);
        }

        const res = await api.post(
          "/auth/refresh",
          { refreshToken },
          { withCredentials: true },
        );
        const newAccessToken = res.data.accessToken;

        // Lưu token mới vào cả Redux store và localStorage
        store.dispatch(setAccessToken(newAccessToken));
        localStorage.setItem("accessToken", newAccessToken);
        
        // Nếu backend trả về refresh token mới
        if (res.data.refreshToken) {
          localStorage.setItem("refreshToken", res.data.refreshToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.log("❌ Refresh token failed, clearing auth state");
        store.dispatch(clearState());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
