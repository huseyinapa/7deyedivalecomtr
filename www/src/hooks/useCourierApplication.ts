import useSWR from "swr";
import {
  courierApplicationService,
  type CreateCourierApplicationDto,
  type CourierApplication,
  type UpdateCourierApplicationDto,
} from "@/lib/api";
import {
  adminApiService,
  type ApplicationFilters,
  type ApplicationsResponse,
  type ApplicationDetails,
} from "@/lib/api/admin.service";

/**
 * Hook to fetch all courier applications
 */
export function useCourierApplications() {
  const { data, error, isLoading, mutate } = useSWR(
    "/courier-application",
    () => courierApplicationService.findAll(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    applications: data || [],
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

/**
 * Hook to create a new courier application
 */
export function useCreateCourierApplication() {
  const createApplication = async (data: CreateCourierApplicationDto) => {
    try {
      const response = await courierApplicationService.create(data);
      return response;
    } catch (error) {
      console.error("Error creating courier application:", error);
      throw error;
    }
  };

  return {
    createApplication,
  };
}

/**
 * Hook to get a single courier application
 */
export function useCourierApplication(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/courier-application/${id}` : null,
    () => courierApplicationService.findOne(id),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    application: data,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

/**
 * Hook to update a courier application
 */
export function useUpdateCourierApplication() {
  const updateApplication = async (
    id: string,
    data: UpdateCourierApplicationDto
  ) => {
    try {
      const response = await courierApplicationService.update(id, data);
      return response;
    } catch (error) {
      console.error("Error updating courier application:", error);
      throw error;
    }
  };

  return {
    updateApplication,
  };
}

/**
 * Hook for admin to get applications with filters
 */
export function useAdminApplications(filters: ApplicationFilters) {
  const key = `admin/applications?${JSON.stringify(filters)}`;

  const { data, error, isLoading, mutate } = useSWR(
    key,
    async () => {
      const response = await adminApiService.getApplications(filters);
      console.log(response);
      console.log("API Response Debug:", {
        applications: response.data?.applications,
        applicationsLength: response.data?.applications?.length,
        pagination: response.data?.pagination,
        summary: response.data?.summary,
      });
      return response.data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    data: data,
    applications: data?.applications,
    applicationsLength: data?.applications?.length,
    pagination: data?.pagination,
    summary: data?.summary,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

/**
 * Hook for admin to get application statistics
 */
export function useApplicationStatistics(period: "week" | "month" | "year") {
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/applications/statistics/${period}`,
    async () => {
      const response = await adminApiService.getApplicationStatistics(period);
      return response;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    statistics: data?.data,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

/**
 * Hook for admin mutations (status updates, exports, etc.)
 */
export function useAdminApplicationMutations() {
  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await adminApiService.updateApplicationStatus(
        id,
        status
      );
      return response;
    } catch (error) {
      console.error("Error updating application status:", error);
      throw error;
    }
  };

  const exportApplications = async (filters?: Partial<ApplicationFilters>) => {
    try {
      const response = await adminApiService.exportApplications(filters || {});
      return response;
    } catch (error) {
      console.error("Error exporting applications:", error);
      throw error;
    }
  };

  const bulkUpdateStatus = async (ids: string[], status: string) => {
    try {
      // Bu fonksiyon henüz backend'de mevcut değil
      // Şimdilik tek tek update yapalım
      const promises = ids.map((id) =>
        adminApiService.updateApplicationStatus(id, status)
      );
      const responses = await Promise.all(promises);
      return responses;
    } catch (error) {
      console.error("Error bulk updating applications:", error);
      throw error;
    }
  };

  return {
    updateStatus,
    exportApplications,
    bulkUpdateStatus,
  };
}
