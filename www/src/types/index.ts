// Main types export file - organized by category

// Authentication types
export * from './auth';

// Courier related types
export * from './courier';

// API and utility types
export * from './api';

// Form types
export * from './forms';

// Legacy type aliases for backward compatibility
export type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse
} from './auth';

export type {
  CallCourier as Call,
  CourierApplication as Application,
  CourierService as Service,
  SenderInfo,
  ReceiverInfo,
  PackageDetails
} from './courier';

export type {
  ApiResponse,
  ApiError,
  ValidationResult
} from './api';

export type {
  ApplicationData,
  ServiceFormData,
  ServiceContactInfo,
  ServiceCompanyInfo
} from './forms';
