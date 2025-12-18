// Frontend
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Queue for requests waiting for token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Process queued requests after token refresh
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    // If Authorization header is already set, it means the response interceptor has handled it (e.g., for a retried request)
    if (config.headers?.Authorization) {
      console.log(`Request Interceptor: Header already set for ${config.url}. Using existing token.`);
      return config;
    }
    
    const token = localStorage.getItem("accessToken");
    console.log(`Request Interceptor: Sending token for ${config.url}:`, token ? `Bearer ${token.substring(0, 10)}...` : 'No Token'); // ADDED LOG
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors and auto refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.log("Axios response interceptor caught an error:", error.response?.status, error.config?.url);
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 error and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Caught 401. Attempting to refresh token.");
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await authService.refreshAccessToken();
        
        // Use a clone of the original request to ensure headers are properly applied
        const retriedRequest = { ...originalRequest };
        if (!retriedRequest.headers) {
          retriedRequest.headers = {};
        }
        retriedRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        retriedRequest._retry = true; // Mark as retried
        
        console.log("Updated originalRequest headers for retry:", retriedRequest.headers.Authorization);

        // Process all queued requests with new token
        processQueue(null, newAccessToken);
        isRefreshing = false;

        console.log("Retrying original request with updated token...");
        return api(retriedRequest); // Use the cloned and updated request
      } catch (refreshError) {
        // Refresh failed - logout user
        processQueue(refreshError as Error, null);
        isRefreshing = false;
        
        authService.logout();
        window.location.href = "/login";
        
        return Promise.reject(refreshError);
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  },
);

export default api;
