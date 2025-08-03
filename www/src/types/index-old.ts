// ===== AUTH & USER TYPES =====
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  isActive?: boolean;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// ===== CALL COURIER TYPES =====
export interface Call {
  id: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  packageDescription?: string;
  packageWeight?: number;
  packageValue?: number;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  uid?: string;
}

export interface SenderInfo {
  name: string;
  phone: string;
  address: string;
}

export interface ReceiverInfo {
  name: string;
  phone: string;
  address: string;
}

export interface PackageDetails {
  description?: string;
  weight?: number;
  value?: number;
  notes?: string;
}

// ===== COURIER APPLICATION TYPES =====
export interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  district?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
  nationality?: string;
  idNumber?: string;
  maritalStatus?: string;
  militaryStatus?: string;
  education?: string;
  licenseClass?: string;
  vehicleType?: string;
  workPeriod?: string;
  hasVehicle?: boolean;
  courierExperience?: string;
  workExperiences?: string;
  references?: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  uid?: string;
}

// ===== COURIER SERVICE TYPES =====
export interface Service {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  sector?: string;
  branchCount?: number;
  startDate?: string;
  courierType?: string;
  courierCount?: number;
  city?: string;
  district?: string;
  address?: string;
  additionalNotes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  uid?: string;
}

// ===== UTILITY TYPES =====
export interface ValidationResult {
  status: boolean;
  reason: string;
  ref?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
  timestamp?: string;
  path?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

// ===== LEGACY TYPES (for backward compatibility) =====
export interface ApplicationData {
  applicationType: {
    workPeriod: string | null;
    exist: boolean;
    vehicleType: string | null;
  };
  personalInformation: {
    firstName: string | null;
    lastName: string | null;
    nationality: string | null;
    idNumber: string | null;
    gender: string | null;
    birthDate: string | null;
    maritalStatus: string | null;
    militaryStatus: string | null;
    education: string | null;
    licenseClass: string | null;
  };
  contactInformation: {
    phoneNumber: string | null;
    email: string | null;
    city: string | null;
    districts: string | null;
    address: string | null;
  };
  jobExperiences: {
    courierExperience: string;
    workExperiences: string;
    workplaces: any[];
  };
  notes: {
    referenceName: string;
    referenceArea: string;
    heardFrom: string;
    note: string;
  };
}

export interface ServiceFormData {
  contactInfo: ServiceContactInfo;
  companyInfo: ServiceCompanyInfo;
}

export interface ServiceContactInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  district: string;
}

export interface ServiceCompanyInfo {
  sector: string;
  companyName: string;
  branchCount: string;
  startDate: string;
  courierType: string;
  courierCount: string;
  additionalNotes: string;
}
