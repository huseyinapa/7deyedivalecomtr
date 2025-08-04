import useSWR from "swr";
import apiClient from "@/utils/axiosInstance";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalLogins: number;
  failedLogins: number;
  blockedIPs: number;
  suspiciousActivity: number;
}

interface AdminTrends {
  loginTrend: Array<{ date: string; count: number }>;
  registrationTrend: Array<{ date: string; count: number }>;
  securityEventsTrend: Array<{ date: string; count: number }>;
}

interface RecentActivity {
  id: string;
  type: "login" | "register" | "failed_login" | "blocked_ip" | "suspicious";
  email?: string;
  ip: string;
  timestamp: string;
  success: boolean;
  message?: string;
}

/**
 * Hook for admin dashboard statistics
 */
export function useAdminStats() {
  const { data, error, isLoading, mutate } = useSWR(
    "/admin/stats",
    async () => {
      try {
        const response = await apiClient.get<{ data: AdminStats }>(
          "/admin/stats"
        );
        return response.data.data;
      } catch (error: any) {
        // Return mock data if endpoint doesn't exist
        if (error?.response?.status === 404) {
          return {
            totalUsers: 1,
            activeUsers: 1,
            totalLogins: 1,
            failedLogins: 0,
            blockedIPs: 0,
            suspiciousActivity: 0,
          } as AdminStats;
        }
        throw error;
      }
    },
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      shouldRetryOnError: (error) => {
        // Don't retry on 404 errors
        return error?.response?.status !== 404;
      },
    }
  );

  return {
    stats: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook for admin dashboard trends
 */
export function useAdminTrends() {
  const { data, error, isLoading, mutate } = useSWR(
    "/admin/trends",
    async () => {
      try {
        const response = await apiClient.get<{ data: AdminTrends }>(
          "/admin/trends"
        );
        return response.data.data;
      } catch (error: any) {
        // Return mock data if endpoint doesn't exist
        if (error?.response?.status === 404) {
          return {
            loginTrend: [
              { date: new Date().toISOString().split("T")[0], count: 1 },
            ],
            registrationTrend: [
              { date: new Date().toISOString().split("T")[0], count: 1 },
            ],
            securityEventsTrend: [
              { date: new Date().toISOString().split("T")[0], count: 0 },
            ],
          } as AdminTrends;
        }
        throw error;
      }
    },
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
      shouldRetryOnError: (error) => {
        return error?.response?.status !== 404;
      },
    }
  );

  return {
    trends: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook for recent activity
 */
export function useRecentActivity(limit: number = 20) {
  const { data, error, isLoading, mutate } = useSWR(
    `/admin/recent-activity?limit=${limit}`,
    async () => {
      try {
        const response = await apiClient.get<{ data: RecentActivity[] }>(
          `/admin/recent-activity?limit=${limit}`
        );
        return response.data.data;
      } catch (error: any) {
        // Return mock data if endpoint doesn't exist
        // if (error?.response?.status === 404) {
        //   return [
        //     {
        //       id: "1",
        //       type: "login" as const,
        //       email: "admin@example.com",
        //       ip: "127.0.0.1",
        //       timestamp: new Date().toISOString(),
        //       success: true,
        //       message: "Successful login",
        //     },
        //   ] as RecentActivity[];
        // }
        throw error;
      }
    },
    {
      refreshInterval: 10000, // Refresh every 10 seconds
      revalidateOnFocus: true,
      shouldRetryOnError: (error) => {
        return error?.response?.status !== 404;
      },
    }
  );

  return {
    activities: data || [],
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook for admin actions
 */
export function useAdminActions() {
  const unblockIP = async (ip: string) => {
    const response = await apiClient.post(`/admin/unblock-ip`, { ip });
    return response.data;
  };

  const unlockUser = async (userId: string) => {
    const response = await apiClient.post(`/admin/unlock-user`, { userId });
    return response.data;
  };

  const deleteUser = async (userId: string) => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  };

  const updateUserRole = async (userId: string, role: "user" | "admin") => {
    const response = await apiClient.patch(`/admin/users/${userId}/role`, {
      role,
    });
    return response.data;
  };

  return {
    unblockIP,
    unlockUser,
    deleteUser,
    updateUserRole,
  };
}
