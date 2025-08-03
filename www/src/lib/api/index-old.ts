/**
 * API Services Index
 * Centralized export for all API services
 */
export {
  authService,
  type LoginCredentials,
  type RegisterData,
  type AuthResponse,
  type User,
} from "./auth.service";
export {
  callCourierService,
  type CreateCallCourierDto,
  type CallCourier,
  type UpdateCallCourierDto,
} from "./call-courier.service";
export {
  courierApplicationService,
  type CreateCourierApplicationDto,
  type CourierApplication,
  type UpdateCourierApplicationDto,
} from "./courier-application.service";
export {
  courierServiceService,
  type CreateCourierServiceDto,
  type CourierService,
  type UpdateCourierServiceDto,
} from "./courier-service.service";

// Re-export axios instance and types
export { default as apiClient } from "@/utils/axiosInstance";
export type { ApiResponse, ApiError } from "@/utils/axiosInstance";
