/**
 * API Services Index
 * Centralized export for all API services
 */

// Service exports
export { authService } from "./auth.service";
export { callCourierService } from "./call-courier.service";
export { courierApplicationService } from "./courier-application.service";
export { courierServiceService } from "./courier-service.service";

// Type exports - prefer importing from @/types instead
export type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from "./auth.service";

export type {
  CallCourier,
  CreateCallCourierDto,
  UpdateCallCourierDto,
} from "./call-courier.service";

export type {
  CourierApplication,
  CreateCourierApplicationDto,
  UpdateCourierApplicationDto,
} from "./courier-application.service";

export type {
  CourierService,
  CreateCourierServiceDto,
  UpdateCourierServiceDto,
} from "./courier-service.service";

// Re-export axios instance and types
export { default as apiClient } from "@/utils/axiosInstance";
export type { ApiResponse, ApiError } from "@/utils/axiosInstance";
