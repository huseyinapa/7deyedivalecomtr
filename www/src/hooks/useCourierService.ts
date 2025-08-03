import useSWR from "swr";
import {
  courierServiceService,
  type CreateCourierServiceDto,
  type CourierService,
  type UpdateCourierServiceDto,
} from "@/lib/api";

/**
 * Hook to fetch all courier services
 */
export function useCourierServices() {
  const { data, error, isLoading, mutate } = useSWR(
    "/courier-service",
    () => courierServiceService.findAll(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    services: data || [],
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch a single courier service
 */
export function useCourierService(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/courier-service/${id}` : null,
    () => (id ? courierServiceService.findOne(id) : null),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    service: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook for courier service mutations
 */
export function useCourierServiceMutations() {
  const createService = async (
    data: CreateCourierServiceDto
  ): Promise<CourierService> => {
    return await courierServiceService.create(data);
  };

  const updateService = async (
    id: string,
    data: UpdateCourierServiceDto
  ): Promise<CourierService> => {
    return await courierServiceService.update(id, data);
  };

  const deleteService = async (id: string): Promise<void> => {
    return await courierServiceService.remove(id);
  };

  const checkUidUnique = async (
    uid: string
  ): Promise<{ isUnique: boolean }> => {
    return await courierServiceService.checkUidUnique(uid);
  };

  return {
    createService,
    updateService,
    deleteService,
    checkUidUnique,
  };
}
