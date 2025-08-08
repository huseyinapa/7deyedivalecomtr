import useSWR from "swr";
import apiClient from "@/utils/axiosInstance";

export interface AdminStats {
  totalUsers: number;
  totalApplications: number;
  totalCalls: number;
  totalServices: number;
  recentLogins: number;
  activeUsers: number;
  activeSessions: number;
  recentlyActiveSessions: number;
  averageSessionDuration: number;
  // Security metrics
  totalLogins: number;
  failedLogins: number;
  blockedIPs: number;
  suspiciousActivity: number;
}

export interface AdminTrends {
  loginTrend: Array<{ date: string; count: number }>;
  registrationTrend: Array<{ date: string; count: number }>;
  securityEventsTrend: Array<{ date: string; count: number }>;
}

export interface RecentActivity {
  id: string;
  type: "login" | "register" | "failed_login" | "blocked_ip" | "suspicious";
  email?: string;
  ip: string;
  timestamp: string;
  success: boolean;
  message?: string;
}

export interface UserSession {
  sessionId: string;
  userId: string;
  email: string;
  ip: string;
  userAgent: string;
  loginTime: string;
  lastActivity: string;
  isActive: boolean;
}

export interface SessionStats {
  totalActiveSessions: number;
  totalActiveUsers: number;
  recentlyActiveSessions: number;
  sessionsLastHour: number;
  averageSessionDuration: number;
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
        console.error("Error fetching admin stats:", error);
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
        console.error("Error fetching admin trends:", error);
        throw error;
      }
    },
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
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
        console.error("Error fetching recent activity:", error);
        throw error;
      }
    },
    {
      refreshInterval: 10000, // Refresh every 10 seconds
      revalidateOnFocus: true,
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

  const endSession = async (sessionId: string) => {
    const response = await apiClient.post(`/admin/sessions/${sessionId}/end`);
    return response.data;
  };

  const endAllUserSessions = async (userId: string) => {
    const response = await apiClient.post(
      `/admin/users/${userId}/sessions/end-all`
    );
    return response.data;
  };

  return {
    unblockIP,
    unlockUser,
    deleteUser,
    updateUserRole,
    endSession,
    endAllUserSessions,
  };
}

/**
 * Hook for active sessions
 */
export function useActiveSessions() {
  const { data, error, isLoading, mutate } = useSWR(
    "/admin/sessions/active",
    async () => {
      try {
        const response = await apiClient.get<{
          data: UserSession[];
          total: number;
        }>("/admin/sessions/active");
        return response.data;
      } catch (error: any) {
        console.error("Error fetching active sessions:", error);
        throw error;
      }
    },
    {
      refreshInterval: 15000, // Refresh every 15 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    sessions: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}

/**
 * Hook for session statistics
 */
export function useSessionStats() {
  const { data, error, isLoading, mutate } = useSWR(
    "/admin/sessions/stats",
    async () => {
      try {
        const response = await apiClient.get<{ data: SessionStats }>(
          "/admin/sessions/stats"
        );
        return response.data.data;
      } catch (error: any) {
        console.error("Error fetching session stats:", error);
        throw error;
      }
    },
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    stats: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}
