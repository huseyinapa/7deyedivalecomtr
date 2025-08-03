// Courier service related types
export interface CourierService {
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

export interface CreateCourierServiceDto {
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
  uid?: string;
}

export interface UpdateCourierServiceDto {
  status?: string;
  additionalNotes?: string;
}
