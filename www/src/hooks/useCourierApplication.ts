import useSWR from "swr";
import {
  courierApplicationService,
  type CreateCourierApplicationDto,
  type CourierApplication,
  type UpdateCourierApplicationDto,
} from "@/lib/api";

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
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch a single courier application
 */
export function useCourierApplication(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/courier-application/${id}` : null,
    () => (id ? courierApplicationService.findOne(id) : null),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    application: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook for courier application mutations
 */
export function useCourierApplicationMutations() {
  const createApplication = async (
    data: CreateCourierApplicationDto
  ): Promise<CourierApplication> => {
    return await courierApplicationService.create(data);
  };

  const updateApplication = async (
    id: string,
    data: UpdateCourierApplicationDto
  ): Promise<CourierApplication> => {
    return await courierApplicationService.update(id, data);
  };

  const deleteApplication = async (id: string): Promise<void> => {
    return await courierApplicationService.remove(id);
  };

  const checkUidUnique = async (
    uid: string
  ): Promise<{ isUnique: boolean }> => {
    return await courierApplicationService.checkUidUnique(uid);
  };

  return {
    createApplication,
    updateApplication,
    deleteApplication,
    checkUidUnique,
  };
}
