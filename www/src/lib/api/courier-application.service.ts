import apiClient, { publicAxiosInstance } from "@/utils/axiosInstance";
import { ApiResponse } from "@/utils/axiosInstance";

/**
 * Courier Application service interface
 */
export interface CreateCourierApplicationDto {
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
  uid?: string;
}

export interface CourierApplication {
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

export interface UpdateCourierApplicationDto {
  status?: string;
  notes?: string;
}

class CourierApplicationService {
  /**
   * Create a new courier application (public - no auth required)
   */
  async create(data: CreateCourierApplicationDto): Promise<CourierApplication> {
    const response = await publicAxiosInstance.post<
      ApiResponse<CourierApplication>
    >("/courier-application", data);

    const result = response.data.data || response.data;

    // Ensure we have a valid CourierApplication object
    if (!result || typeof result !== "object" || !("id" in result)) {
      throw new Error("Invalid courier application response");
    }

    return result as CourierApplication;
  }

  /**
   * Get all courier applications (admin - auth required)
   */
  async findAll(): Promise<CourierApplication[]> {
    const response = await apiClient.get<ApiResponse<CourierApplication[]>>(
      "/courier-application"
    );

    const result = response.data.data || response.data;

    // Ensure we have an array
    if (!Array.isArray(result)) {
      throw new Error("Invalid courier application list response");
    }

    return result as CourierApplication[];
  }

  /**
   * Get a single courier application by ID (admin - auth required)
   */
  async findOne(id: string): Promise<CourierApplication> {
    const response = await apiClient.get<ApiResponse<CourierApplication>>(
      `/courier-application/${id}`
    );

    const result = response.data.data || response.data;

    // Ensure we have a valid CourierApplication object
    if (!result || typeof result !== "object" || !("id" in result)) {
      throw new Error("Invalid courier application response");
    }

    return result as CourierApplication;
  }

  /**
   * Update a courier application (admin - auth required)
   */
  async update(
    id: string,
    data: UpdateCourierApplicationDto
  ): Promise<CourierApplication> {
    const response = await apiClient.patch<ApiResponse<CourierApplication>>(
      `/courier-application/${id}`,
      data
    );

    const result = response.data.data || response.data;

    // Ensure we have a valid CourierApplication object
    if (!result || typeof result !== "object" || !("id" in result)) {
      throw new Error("Invalid courier application update response");
    }

    return result as CourierApplication;
  }

  /**
   * Delete a courier application (admin - auth required)
   */
  async remove(id: string): Promise<void> {
    await apiClient.delete(`/courier-application/${id}`);
  }

  /**
   * Check if UID is unique (public - no auth required)
   */
  async checkUidUnique(uid: string): Promise<{ isUnique: boolean }> {
    const response = await publicAxiosInstance.get<
      ApiResponse<{ isUnique: boolean }>
    >(`/courier-application/check-uid?uid=${uid}`);

    const result = response.data.data || response.data;

    // Ensure we have a valid response with isUnique property
    if (!result || typeof result !== "object" || !("isUnique" in result)) {
      throw new Error("Invalid UID check response");
    }

    return result as { isUnique: boolean };
  }
}

export const courierApplicationService = new CourierApplicationService();
export default courierApplicationService;
