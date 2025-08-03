import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { toast } from "react-hot-toast";

/**
 * API Response structure based on NestJS backend
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  timestamp?: string;
  path?: string;
}

/**
 * Error response structure
 */
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

/**
 * Base axios instance configuration
 */
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7700";
const timeout = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000", 10);

/**
 * Main axios instance for API calls (with auth)
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Public axios instance for form submissions (no auth required)
 */
const publicAxiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request interceptor to add auth token
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookie
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for public API (no auth redirects)
 */
publicAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle common HTTP errors (but don't redirect on 401)
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // For public endpoints, 401 means the endpoint doesn't exist or server error
          toast.error("Hizmet şu anda kullanılamıyor");
          break;
        case 403:
          toast.error("Bu işlem için yetkiniz bulunmamaktadır");
          break;
        case 404:
          toast.error("İstenen kaynak bulunamadı");
          break;
        case 422:
          toast.error("Gönderilen veriler hatalı");
          break;
        case 500:
          toast.error("Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin");
          break;
        default:
          toast.error(data?.message || "Bir hata oluştu");
      }
    } else if (error.request) {
      // Network error
      toast.error("Bağlantı hatası. İnternet bağlantınızı kontrol edin");
    } else {
      // Other errors
      toast.error("Beklenmeyen bir hata oluştu");
    }

    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle errors globally (with auth)
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // Handle common HTTP errors
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (typeof window !== "undefined") {
            window.location.href = "/admin/login";
          }
          break;
        case 403:
          toast.error("Bu işlem için yetkiniz bulunmamaktadır");
          break;
        case 404:
          toast.error("İstenen kaynak bulunamadı");
          break;
        case 422:
          toast.error("Gönderilen veriler hatalı");
          break;
        case 500:
          toast.error("Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin");
          break;
        default:
          toast.error(data?.message || "Bir hata oluştu");
      }
    } else if (error.request) {
      // Network error
      toast.error("Bağlantı hatası. İnternet bağlantınızı kontrol edin");
    } else {
      // Other errors
      toast.error("Beklenmeyen bir hata oluştu");
    }

    return Promise.reject(error);
  }
);

export { publicAxiosInstance };
export default axiosInstance;
