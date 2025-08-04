/**
 * Admin API Service
 * Provides comprehensive admin dashboard functionality
 */

import apiClient, { ApiResponse } from "@/utils/axiosInstance";

// Dashboard Statistics Interface
export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalCouriers: number;
  activeCouriers: number;
  availableCouriers: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  todayOrders: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  averageDeliveryTime: number;
  completionRate: number;
  customerSatisfaction: number;
}

// System Health Interface
export interface SystemHealth {
  status: "healthy" | "warning" | "critical";
  uptime: number;
  environment: string;
  timestamp: string;
  services: {
    database: "online" | "offline" | "degraded";
    redis: "online" | "offline" | "degraded";
    notifications: "online" | "offline" | "degraded";
  };
  performance: {
    responseTime: number;
    cpuUsage: number;
    memoryUsage: number;
  };
}

// Recent Activity Interface
export interface RecentActivity {
  id: string;
  type: "order" | "courier" | "application" | "system" | "user";
  action: string;
  description: string;
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
  timestamp: string;
  status: "success" | "warning" | "error" | "info";
  metadata?: Record<string, any>;
}

// Analytics Data Interface
export interface AnalyticsData {
  ordersByStatus: Array<{ status: string; count: number; percentage: number }>;
  couriersByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  applicationsByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  revenueByPeriod: Array<{ period: string; revenue: number }>;
  ordersByHour: Array<{ hour: number; count: number }>;
  topCouriers: Array<{
    id: string;
    name: string;
    email: string;
    completedOrders: number;
    rating: number;
    revenue: number;
  }>;
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    customerRetentionRate: number;
  };
}

// User Management Interface
export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "user" | "courier";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

export interface CreateUserDto {
  email: string;
  password: string;
  role: "admin" | "user" | "courier";
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

export interface UpdateUserDto {
  email?: string;
  role?: "admin" | "user" | "courier";
  isActive?: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

// Application Management Interfaces
export interface ApplicationSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  workPeriod: string;
  status: string;
  completionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationDetails extends ApplicationSummary {
  address: string;
  birthDate: string;
  gender: string;
  idNumber: string;
  nationality: string;
  education: string;
  licenseClass: string;
  vehicleType: string;
  workExperiences: string;
  courierExperience: string;
  notes: string;
  statusHistory: Array<{
    status: string;
    changedBy: string;
    changedAt: string;
    reason?: string;
  }>;
}

export interface ApplicationsResponse {
  data: {
    applications: ApplicationSummary[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    summary: {
      totalApplications: number;
      byStatus: Record<string, number>;
      byWorkPeriod: Record<string, number>;
    };
  };
}

export interface ApplicationFilters {
  page?: number;
  limit?: number;
  status?: string;
  workPeriod?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ApplicationStatistics {
  totalApplications: number;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
    label: string;
  }>;
  workPeriodDistribution: Array<{
    workPeriod: string;
    count: number;
    percentage: number;
    label: string;
  }>;
  averageCompletionRate: number;
  topCities: Array<{
    city: string;
    count: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    count: number;
    approved: number;
    rejected: number;
  }>;
}

class AdminApiService {
  private baseUrl = "/admin";

  // Dashboard Statistics
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get(`${this.baseUrl}/dashboard/stats`);
  }

  async getSystemHealth(): Promise<ApiResponse<SystemHealth>> {
    return apiClient.get(`${this.baseUrl}/system/health`);
  }

  async getRecentActivities(
    limit: number = 20
  ): Promise<ApiResponse<RecentActivity[]>> {
    return apiClient.get(`${this.baseUrl}/activities/recent`, {
      params: { limit },
    });
  }

  async getAnalytics(
    period: "day" | "week" | "month" | "year" = "week"
  ): Promise<ApiResponse<AnalyticsData>> {
    return apiClient.get(`${this.baseUrl}/analytics`, {
      params: { period },
    });
  }

  // User Management
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    isActive?: boolean;
  }): Promise<
    ApiResponse<{
      users: AdminUser[];
      total: number;
      page: number;
      totalPages: number;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/users`, { params });
  }

  async getUserById(id: string): Promise<ApiResponse<AdminUser>> {
    return apiClient.get(`${this.baseUrl}/users/${id}`);
  }

  async createUser(userData: CreateUserDto): Promise<ApiResponse<AdminUser>> {
    return apiClient.post(`${this.baseUrl}/users`, userData);
  }

  async updateUser(
    id: string,
    userData: UpdateUserDto
  ): Promise<ApiResponse<AdminUser>> {
    return apiClient.patch(`${this.baseUrl}/users/${id}`, userData);
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseUrl}/users/${id}`);
  }

  async toggleUserStatus(id: string): Promise<ApiResponse<AdminUser>> {
    return apiClient.patch(`${this.baseUrl}/users/${id}/toggle-status`);
  }

  // Order Management
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    courierId?: string;
    customerId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<
    ApiResponse<{
      orders: any[];
      total: number;
      page: number;
      totalPages: number;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/orders`, { params });
  }

  async updateOrderStatus(
    id: string,
    status: string,
    notes?: string
  ): Promise<ApiResponse<any>> {
    return apiClient.patch(`${this.baseUrl}/orders/${id}/status`, {
      status,
      notes,
    });
  }

  // Courier Management
  async getCouriers(params?: {
    page?: number;
    limit?: number;
    status?: string;
    vehicleType?: string;
    isActive?: boolean;
  }): Promise<
    ApiResponse<{
      couriers: any[];
      total: number;
      page: number;
      totalPages: number;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/couriers`, { params });
  }

  async approveCourierApplication(
    id: string,
    notes?: string
  ): Promise<ApiResponse<any>> {
    return apiClient.patch(
      `${this.baseUrl}/courier-applications/${id}/approve`,
      { notes }
    );
  }

  async rejectCourierApplication(
    id: string,
    reason: string
  ): Promise<ApiResponse<any>> {
    return apiClient.patch(
      `${this.baseUrl}/courier-applications/${id}/reject`,
      { reason }
    );
  }

  // System Operations
  async exportData(
    type: "orders" | "users" | "couriers",
    format: "csv" | "excel" = "csv"
  ): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/export/${type}`, {
      params: { format },
      responseType: "blob",
    });
    return response.data;
  }

  async sendBulkNotification(data: {
    recipient: "all" | "couriers" | "customers";
    title: string;
    message: string;
    type: "info" | "warning" | "success";
  }): Promise<ApiResponse<{ sentCount: number }>> {
    return apiClient.post(`${this.baseUrl}/notifications/bulk`, data);
  }

  async clearCache(): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post(`${this.baseUrl}/system/clear-cache`);
  }

  async restartServices(): Promise<ApiResponse<{ success: boolean }>> {
    return apiClient.post(`${this.baseUrl}/system/restart-services`);
  }

  // ===== YENİ BAŞVURU YÖNETİMİ METHOD'LARI =====

  // Paginated applications with filtering and sorting
  async getApplications(
    filters: ApplicationFilters = {}
  ): Promise<ApiResponse<ApplicationsResponse>> {
    const params = new URLSearchParams();

    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.workPeriod) params.append("workPeriod", filters.workPeriod);
    if (filters.search) params.append("search", filters.search);
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    return apiClient.get(`${this.baseUrl}/applications?${params.toString()}`);
  }

  // Get detailed application by ID
  async getApplicationById(
    id: string
  ): Promise<ApiResponse<ApplicationDetails>> {
    return apiClient.get(`${this.baseUrl}/applications/${id}`);
  }

  // Update application status
  async updateApplicationStatus(
    id: string,
    status: string,
    reason?: string
  ): Promise<ApiResponse<{ id: string; status: string; updatedAt: string }>> {
    return apiClient.put(`${this.baseUrl}/applications/${id}/status`, {
      status,
      reason,
    });
  }

  // Export applications to CSV
  async exportApplications(
    filters: {
      status?: string;
      workPeriod?: string;
      search?: string;
    } = {}
  ): Promise<
    ApiResponse<{
      filename: string;
      headers: string[];
      rows: string[][];
      count: number;
    }>
  > {
    const params = new URLSearchParams();

    if (filters.status) params.append("status", filters.status);
    if (filters.workPeriod) params.append("workPeriod", filters.workPeriod);
    if (filters.search) params.append("search", filters.search);

    return apiClient.get(
      `${this.baseUrl}/applications/export?${params.toString()}`
    );
  }

  // Get application statistics
  async getApplicationStatistics(
    period: "week" | "month" | "year" | "all" = "week"
  ): Promise<ApiResponse<ApplicationStatistics>> {
    return apiClient.get(`${this.baseUrl}/applications/statistics`, {
      params: { period },
    });
  }

  // Bulk operations for applications
  async bulkUpdateApplications(data: {
    applicationIds: string[];
    status: string;
    reason?: string;
  }): Promise<ApiResponse<{ updated: number; failed: number }>> {
    return apiClient.put(`${this.baseUrl}/applications/bulk-update`, data);
  }

  // Get application status history
  async getApplicationStatusHistory(id: string): Promise<
    ApiResponse<
      Array<{
        status: string;
        changedBy: string;
        changedAt: string;
        reason?: string;
      }>
    >
  > {
    return apiClient.get(`${this.baseUrl}/applications/${id}/history`);
  }

  // Advanced search applications
  async searchApplications(query: {
    text?: string;
    status?: string[];
    workPeriod?: string[];
    cities?: string[];
    dateRange?: {
      start: string;
      end: string;
    };
    completionRate?: {
      min: number;
      max: number;
    };
  }): Promise<ApiResponse<ApplicationSummary[]>> {
    return apiClient.post(`${this.baseUrl}/applications/search`, query);
  }
}

export const adminApiService = new AdminApiService();
