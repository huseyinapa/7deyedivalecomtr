import apiClient, { publicAxiosInstance } from "@/utils/axiosInstance";
import { ApiResponse } from "@/utils/axiosInstance";

/**
 * Courier Service interface
 */
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

export interface UpdateCourierServiceDto {
  status?: string;
  additionalNotes?: string;
}

class CourierServiceService {
  /**
   * Create a new courier service request (public - no auth required)
   */
  async create(data: CreateCourierServiceDto): Promise<CourierService> {
    const response = await publicAxiosInstance.post<
      ApiResponse<CourierService>
    >("/courier-service", data);

    const result = response.data.data || response.data;

    // Ensure we have a valid CourierService object
    if (!result || typeof result !== "object" || !("id" in result)) {
      console.log("Courier service creation failed:", result);
      throw new Error("Invalid courier service response");
    }
    console.log("Courier service created:", result);

    return result as CourierService;
  }

  /**
   * Get all courier service requests (admin - auth required)
   */
  async findAll(): Promise<CourierService[]> {
    const response = await apiClient.get<ApiResponse<CourierService[]>>(
      "/courier-service"
    );

    const result = response.data.data || response.data;

    // Ensure we have an array
    if (!Array.isArray(result)) {
      throw new Error("Invalid courier service list response");
    }

    return result as CourierService[];
  }

  /**
   * Get a single courier service request by ID (admin - auth required)
   */
  async findOne(id: string): Promise<CourierService> {
    const response = await apiClient.get<ApiResponse<CourierService>>(
      `/courier-service/${id}`
    );

    const result = response.data.data || response.data;

    // Ensure we have a valid CourierService object
    if (!result || typeof result !== "object" || !("id" in result)) {
      throw new Error("Invalid courier service response");
    }

    return result as CourierService;
  }

  /**
   * Update a courier service request (admin - auth required)
   */
  async update(
    id: string,
    data: UpdateCourierServiceDto
  ): Promise<CourierService> {
    const response = await apiClient.patch<ApiResponse<CourierService>>(
      `/courier-service/${id}`,
      data
    );

    const result = response.data.data || response.data;

    // Ensure we have a valid CourierService object
    if (!result || typeof result !== "object" || !("id" in result)) {
      throw new Error("Invalid courier service update response");
    }

    return result as CourierService;
  }

  /**
   * Delete a courier service request (admin - auth required)
   */
  async remove(id: string): Promise<void> {
    await apiClient.delete(`/courier-service/${id}`);
  }

  /**
   * Check if UID is unique (public - no auth required)
   */
  async checkUidUnique(uid: string): Promise<{ isUnique: boolean }> {
    const response = await publicAxiosInstance.get<
      ApiResponse<{ isUnique: boolean }>
    >(`/courier-service/check-uid?uid=${uid}`);

    const result = response.data.data || response.data;

    // Ensure we have a valid response with isUnique property
    if (!result || typeof result !== "object" || !("isUnique" in result)) {
      throw new Error("Invalid UID check response");
    }

    return result as { isUnique: boolean };
  }
}

export const courierServiceService = new CourierServiceService();
export default courierServiceService;
