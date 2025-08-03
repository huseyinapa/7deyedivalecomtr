import useSWR from "swr";
import {
  callCourierService,
  type CreateCallCourierDto,
  type CallCourier,
  type UpdateCallCourierDto,
} from "@/lib/api";

/**
 * Hook to fetch all call courier requests
 */
export function useCallCouriers() {
  const { data, error, isLoading, mutate } = useSWR(
    "/call-courier",
    () => callCourierService.findAll(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    callCouriers: data || [],
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook to fetch a single call courier request
 */
export function useCallCourier(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/call-courier/${id}` : null,
    () => (id ? callCourierService.findOne(id) : null),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    callCourier: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook for call courier mutations
 */
export function useCallCourierMutations() {
  const createCallCourier = async (
    data: CreateCallCourierDto
  ): Promise<CallCourier> => {
    return await callCourierService.create(data);
  };

  const updateCallCourier = async (
    id: string,
    data: UpdateCallCourierDto
  ): Promise<CallCourier> => {
    return await callCourierService.update(id, data);
  };

  const deleteCallCourier = async (id: string): Promise<void> => {
    return await callCourierService.remove(id);
  };

  const checkUidUnique = async (
    uid: string
  ): Promise<{ isUnique: boolean }> => {
    return await callCourierService.checkUidUnique(uid);
  };

  return {
    createCallCourier,
    updateCallCourier,
    deleteCallCourier,
    checkUidUnique,
  };
}
