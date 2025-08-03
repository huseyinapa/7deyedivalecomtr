import apiClient, { publicAxiosInstance } from "@/utils/axiosInstance";
import { ApiResponse } from "@/utils/axiosInstance";

/**
 * Call Courier service interface
 */
export interface CreateCallCourierDto {
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
  uid?: string;
}

export interface CallCourier {
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

export interface UpdateCallCourierDto {
  status?: string;
  notes?: string;
}

class CallCourierService {
  /**
   * Create a new call courier request (public - no auth required)
   */
  async create(data: CreateCallCourierDto): Promise<CallCourier> {
    const response = await publicAxiosInstance.post<ApiResponse<CallCourier>>(
      "/call-courier",
      data
    );

    const result = response.data.data || response.data;

    // Ensure we have a valid CallCourier object
    if (!result || typeof result !== "object" || !("id" in result)) {
      throw new Error("Invalid call courier response");
    }

    return result as CallCourier;
  }

  /**
   * Get all call courier requests (admin - auth required)
   */
  async findAll(): Promise<CallCourier[]> {
    const response = await apiClient.get<ApiResponse<CallCourier[]>>(
      "/call-courier"
    );

    const result = response.data.data || response.data;

    // Ensure we have an array
    if (!Array.isArray(result)) {
      throw new Error("Invalid call courier list response");
    }

    return result as CallCourier[];
  }

  /**
   * Get a single call courier request by ID (admin - auth required)
   */
  async findOne(id: string): Promise<CallCourier> {
    const response = await apiClient.get<ApiResponse<CallCourier>>(
      `/call-courier/${id}`
    );

    const result = response.data.data || response.data;

    // Ensure we have a valid CallCourier object
    if (!result || typeof result !== "object" || !("id" in result)) {
      throw new Error("Invalid call courier response");
    }

    return result as CallCourier;
  }

  /**
   * Update a call courier request (admin - auth required)
   */
  async update(id: string, data: UpdateCallCourierDto): Promise<CallCourier> {
    const response = await apiClient.patch<ApiResponse<CallCourier>>(
      `/call-courier/${id}`,
      data
    );

    const result = response.data.data || response.data;

    // Ensure we have a valid CallCourier object
    if (!result || typeof result !== "object" || !("id" in result)) {
      throw new Error("Invalid call courier update response");
    }

    return result as CallCourier;
  }

  /**
   * Delete a call courier request (admin - auth required)
   */
  async remove(id: string): Promise<void> {
    await apiClient.delete(`/call-courier/${id}`);
  }

  /**
   * Check if UID is unique (public - no auth required)
   */
  async checkUidUnique(uid: string): Promise<{ isUnique: boolean }> {
    const response = await publicAxiosInstance.get<
      ApiResponse<{ isUnique: boolean }>
    >(`/call-courier/check-uid?uid=${uid}`);

    const result = response.data.data || response.data;

    // Ensure we have a valid response with isUnique property
    if (!result || typeof result !== "object" || !("isUnique" in result)) {
      throw new Error("Invalid UID check response");
    }

    return result as { isUnique: boolean };
  }
}

export const callCourierService = new CallCourierService();
export default callCourierService;
