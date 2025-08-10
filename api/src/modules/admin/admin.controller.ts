import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  Param,
  DefaultValuePipe,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { AuthService } from "../auth/auth.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CourierApplicationService } from "../courier-application/courier-application.service";
import { Like, In } from "typeorm";
import * as os from "os";

@ApiTags("admin")
@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly authService: AuthService,
    private readonly courierApplicationService: CourierApplicationService
  ) {}

  @Get("dashboard/stats")
  @Roles("admin")
  @ApiOperation({ summary: "Get dashboard statistics" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Dashboard statistics",
  })
  async getDashboardStats(): Promise<{
    success: boolean;
    data: {
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
      interviewedApplications: number;
      todayOrders: number;
      weeklyRevenue: number;
      monthlyRevenue: number;
      averageDeliveryTime: number;
      completionRate: number;
      customerSatisfaction: number;
      activeUsers: number;
      activeSessions: number;
      recentLogins: number;
      // Security metrics
      totalLogins: number;
      failedLogins: number;
      blockedIPs: number;
      suspiciousActivity: number;
    };
  }> {
    try {
      // Get real application statistics
      const applications = await this.courierApplicationService.findAll();
      const sessionStats = this.authService.getSessionStats();
      const loginAttempts = this.authService.getLoginAttempts();

      // Calculate security metrics
      const totalLogins = loginAttempts.filter(
        (attempt) => attempt.success
      ).length;
      const failedLogins = loginAttempts.filter(
        (attempt) => !attempt.success
      ).length;
      const blockedIPs = this.authService.getBlockedIPs().length;
      const suspiciousActivity = loginAttempts.filter(
        (attempt) =>
          !attempt.success &&
          Date.now() - attempt.timestamp.getTime() < 60 * 60 * 1000 // Last hour
      ).length;

      const pendingApplications = applications.filter(
        (app) => app.status === "pending"
      ).length;
      const approvedApplications = applications.filter(
        (app) => app.status === "approved"
      ).length;
      const rejectedApplications = applications.filter(
        (app) => app.status === "rejected"
      ).length;
      const interviewedApplications = applications.filter(
        (app) => app.status === "interviewed"
      ).length;

      const recentSuccessfulLogins = loginAttempts.filter(
        (attempt) =>
          attempt.success &&
          Date.now() - attempt.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
      ).length;

      return {
        success: true,
        data: {
          totalOrders: 0, // Not implemented yet
          activeOrders: 0, // Not implemented yet
          completedOrders: 0, // Not implemented yet
          cancelledOrders: 0, // Not implemented yet
          totalCouriers: 0, // Not implemented yet
          activeCouriers: 0, // Not implemented yet
          availableCouriers: 0, // Not implemented yet
          pendingApplications,
          approvedApplications,
          rejectedApplications,
          interviewedApplications,
          todayOrders: 0, // Not implemented yet
          weeklyRevenue: 0, // Not implemented yet
          monthlyRevenue: 0, // Not implemented yet
          averageDeliveryTime: 0, // Not implemented yet
          completionRate: 0, // Not implemented yet
          customerSatisfaction: 0, // Not implemented yet
          activeUsers: sessionStats.totalActiveUsers,
          activeSessions: sessionStats.totalActiveSessions,
          recentLogins: recentSuccessfulLogins,
          // Security metrics
          totalLogins,
          failedLogins,
          blockedIPs,
          suspiciousActivity,
        },
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  }

  @Get("system/health")
  @Roles("admin")
  @ApiOperation({ summary: "Get system health status" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "System health information",
  })
  async getSystemHealth(): Promise<{
    success: boolean;
    data: {
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
    };
  }> {
    const startTime = Date.now();
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    // Test database connection
    let databaseStatus: "online" | "offline" | "degraded" = "online";
    let dbResponseTime = 0;

    try {
      const dbStart = Date.now();
      await this.courierApplicationService.findAll();
      dbResponseTime = Date.now() - dbStart;

      if (dbResponseTime > 1000) {
        databaseStatus = "degraded";
      }
    } catch (error) {
      databaseStatus = "offline";
      dbResponseTime = -1;
    }

    const responseTime = Date.now() - startTime;

    // Calculate memory usage percentage (assuming 1GB available memory)
    const memoryUsagePercent = Math.round(
      (memoryUsage.heapUsed / (1024 * 1024 * 1024)) * 100
    );

    const cpuUsage = await new Promise<number>((resolve) => {
      const startTime = process.hrtime();
      const startUsage = process.cpuUsage();

      setTimeout(() => {
        const elapsedTime = process.hrtime(startTime);
        const elapsedUsage = process.cpuUsage(startUsage);

        const elapsedTimeMs = elapsedTime[0] * 1000 + elapsedTime[1] / 1e6;
        const elapsedUserMs = elapsedUsage.user / 1000;
        const elapsedSystemMs = elapsedUsage.system / 1000;

        const cpuPercent = (
          ((elapsedUserMs + elapsedSystemMs) / elapsedTimeMs) *
          100
        ).toFixed(2);
        resolve(parseFloat(cpuPercent));
      }, 100);
    });

    // Determine overall system status
    let systemStatus: "healthy" | "warning" | "critical" = "healthy";

    if (
      databaseStatus === "offline" ||
      memoryUsagePercent > 90 ||
      cpuUsage > 80
    ) {
      systemStatus = "critical";
    } else if (
      databaseStatus === "degraded" ||
      memoryUsagePercent > 70 ||
      cpuUsage > 60 ||
      responseTime > 500
    ) {
      systemStatus = "warning";
    }

    return {
      success: true,
      data: {
        status: systemStatus,
        uptime: Math.floor(uptime),
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString(),
        services: {
          database: databaseStatus,
          redis: "online", // Redis not implemented yet, assume online
          notifications: "offline", // Notifications not implemented yet, assume online
        },
        performance: {
          responseTime: responseTime + dbResponseTime,
          cpuUsage: Math.min(cpuUsage, 100),
          memoryUsage: Math.min(memoryUsagePercent, 100),
        },
      },
    };
  }

  @Get("activities/recent")
  @Roles("admin")
  @ApiOperation({ summary: "Get recent activities" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Recent system activities",
  })
  async getRecentActivities(@Query("limit") limit: number = 20): Promise<{
    success: boolean;
    data: Array<{
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
    }>;
  }> {
    // Return empty activities since we don't have real activity tracking yet
    return {
      success: true,
      data: [],
    };
  }

  @Get("analytics")
  @Roles("admin")
  @ApiOperation({ summary: "Get analytics data" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Analytics data for the specified period",
  })
  async getAnalytics(
    @Query("period") period: "day" | "week" | "month" | "year" = "week"
  ): Promise<{
    success: boolean;
    data: {
      ordersByStatus: Array<{
        status: string;
        count: number;
        percentage: number;
      }>;
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
    };
  }> {
    try {
      // Get real application statistics
      const applications = await this.courierApplicationService.findAll();

      const statusCounts = applications.reduce(
        (acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const total = applications.length;
      const applicationsByStatus = Object.entries(statusCounts).map(
        ([status, count]) => ({
          status,
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
        })
      );

      return {
        success: true,
        data: {
          ordersByStatus: [], // Not implemented yet
          couriersByStatus: [], // Not implemented yet
          applicationsByStatus,
          revenueByPeriod: [], // Not implemented yet
          ordersByHour: [], // Not implemented yet
          topCouriers: [], // Not implemented yet
          customerMetrics: {
            newCustomers: 0, // Not implemented yet
            returningCustomers: 0, // Not implemented yet
            customerRetentionRate: 0, // Not implemented yet
          },
        },
      };
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  }

  @Get("login-attempts")
  @Roles("admin")
  @ApiOperation({ summary: "Get recent login attempts (Admin only)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of recent login attempts",
  })
  async getLoginAttempts(
    @Query("limit") limit?: number,
    @CurrentUser() user?: any
  ): Promise<{ success: boolean; data: any[]; total: number }> {
    const attempts = this.authService.getLoginAttempts(limit || 100);
    return {
      success: true,
      data: attempts,
      total: attempts.length,
    };
  }

  @Get("blocked-accounts")
  @Roles("admin")
  @ApiOperation({ summary: "Get blocked accounts (Admin only)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of blocked accounts",
  })
  async getBlockedAccounts(@CurrentUser() user?: any) {
    const blocked = this.authService.getBlockedAccounts();
    return {
      success: true,
      data: blocked,
      total: blocked.length,
    };
  }

  @Get("stats")
  @Roles("admin")
  @ApiOperation({ summary: "Get admin dashboard statistics" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Admin statistics retrieved successfully",
  })
  async getStats(@CurrentUser() user?: any) {
    try {
      // Get real statistics from database
      const applications = await this.courierApplicationService.findAll();
      const loginAttempts = this.authService.getLoginAttempts();
      const sessionStats = this.authService.getSessionStats();

      return {
        success: true,
        data: {
          totalUsers: 0, // Not implemented yet - need user service
          totalApplications: applications.length,
          totalCalls: 0, // Not implemented yet - need call service
          totalServices: 0, // Not implemented yet - need service tracking
          recentLogins: loginAttempts.filter((attempt) => attempt.success)
            .length,
          activeUsers: sessionStats.totalActiveUsers,
          activeSessions: sessionStats.totalActiveSessions,
          recentlyActiveSessions: sessionStats.recentlyActiveSessions,
          averageSessionDuration: sessionStats.averageSessionDuration,
        },
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
  }

  @Get("trends")
  @Roles("admin")
  @ApiOperation({ summary: "Get admin dashboard trends" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Admin trends retrieved successfully",
  })
  async getTrends(@Query("period") period?: string, @CurrentUser() user?: any) {
    try {
      // Return empty trends data since we don't have historical tracking yet
      return {
        success: true,
        data: [],
      };
    } catch (error) {
      console.error("Error fetching trends:", error);
      throw error;
    }
  }

  @Get("recent-activity")
  @Roles("admin")
  @ApiOperation({ summary: "Get recent admin activity" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Recent activity retrieved successfully",
  })
  async getRecentActivity(
    @Query("limit") limit?: number,
    @CurrentUser() user?: any
  ) {
    const activities = this.authService.getLoginAttempts();
    const limitNum = limit ? parseInt(limit.toString()) : 20;

    return {
      success: true,
      data: activities.slice(0, limitNum).map((attempt) => ({
        id: attempt.timestamp.toString(),
        type: attempt.success ? "login" : "failed_login",
        email: attempt.email,
        ip: attempt.ip,
        timestamp: attempt.timestamp,
        success: attempt.success,
        message: attempt.success ? "Successful login" : "Failed login attempt",
      })),
    };
  }

  @Post("unlock-account")
  @Roles("admin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Unlock a blocked account (Admin only)" })
  async unlockAccount(@Body("email") email: string): Promise<{
    success: boolean;
    message: string;
  }> {
    const unlocked = this.authService.unlockAccount(email);
    return {
      success: true,
      message: unlocked
        ? `Account ${email} has been unlocked`
        : `Account ${email} was not locked`,
    };
  }

  @Post("reset-attempts")
  @Roles("admin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reset all login attempts (Admin only)" })
  async resetAttempts(): Promise<{
    success: boolean;
    message: string;
  }> {
    this.authService.resetAllAttempts();
    return {
      success: true,
      message: "All login attempts and blocks have been reset",
    };
  }

  @Get("sessions/active")
  @Roles("admin")
  @ApiOperation({ summary: "Get active user sessions" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of active user sessions",
  })
  async getActiveSessions(@CurrentUser() user?: any) {
    const sessions = this.authService.getActiveSessions();
    return {
      success: true,
      data: sessions,
      total: sessions.length,
    };
  }

  @Get("sessions/stats")
  @Roles("admin")
  @ApiOperation({ summary: "Get session statistics" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Session statistics",
  })
  async getSessionStats(@CurrentUser() user?: any) {
    const stats = this.authService.getSessionStats();
    return {
      success: true,
      data: stats,
    };
  }

  @Post("sessions/:sessionId/end")
  @Roles("admin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "End a specific session (Admin only)" })
  @ApiParam({ name: "sessionId", description: "Session ID to end" })
  async endSession(@Param("sessionId") sessionId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    this.authService.endSession(sessionId);
    return {
      success: true,
      message: `Session ${sessionId} has been ended`,
    };
  }

  @Post("users/:userId/sessions/end-all")
  @Roles("admin")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "End all sessions for a user (Admin only)" })
  @ApiParam({ name: "userId", description: "User ID to end all sessions for" })
  async endAllUserSessions(@Param("userId") userId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    this.authService.endAllUserSessions(userId);
    return {
      success: true,
      message: `All sessions for user ${userId} have been ended`,
    };
  }

  // ===== BAŞVURU YÖNETİMİ ENDPOINT'LERİ =====

  @Get("applications")
  @Roles("admin")
  @ApiOperation({
    summary: "Get courier applications with pagination and filtering",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page (default: 10)",
  })
  @ApiQuery({
    name: "status",
    required: false,
    type: String,
    description: "Filter by status",
  })
  @ApiQuery({
    name: "workPeriod",
    required: false,
    type: String,
    description: "Filter by work period",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search in name, email, phone",
  })
  @ApiQuery({
    name: "sortBy",
    required: false,
    type: String,
    description: "Sort field (default: createdAt)",
  })
  @ApiQuery({
    name: "sortOrder",
    required: false,
    type: String,
    description: "Sort order: asc or desc (default: desc)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Paginated courier applications",
  })
  async getApplications(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("sortBy", new DefaultValuePipe("createdAt")) sortBy: string,
    @Query("sortOrder", new DefaultValuePipe("desc")) sortOrder: "asc" | "desc",
    @Query("status") status?: string,
    @Query("workPeriod") workPeriod?: string,
    @Query("search") search?: string
  ): Promise<{
    success: boolean;
    data: {
      applications: Array<{
        id: string;
        uid?: string;
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
        status: string;
        notes?: string;
        completionRate: number;
        createdAt: string;
        updatedAt: string;
      }>;
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
  }> {
    try {
      // Build query conditions
      const queryBuilder =
        this.courierApplicationService[
          "courierApplicationRepository"
        ].createQueryBuilder("application");

      // Apply filters
      if (status) {
        queryBuilder.andWhere("application.status = :status", { status });
      }

      if (workPeriod) {
        queryBuilder.andWhere("application.workPeriod = :workPeriod", {
          workPeriod,
        });
      }

      if (search) {
        queryBuilder.andWhere(
          "(application.firstName ILIKE :search OR application.lastName ILIKE :search OR application.email ILIKE :search OR application.phone ILIKE :search)",
          { search: `%${search}%` }
        );
      }

      // Get total count for pagination
      const total = await queryBuilder.getCount();

      // Apply sorting
      const sortField =
        sortBy === "createdAt"
          ? "application.createdAt"
          : `application.${sortBy}`;
      queryBuilder.orderBy(
        sortField,
        sortOrder.toUpperCase() as "ASC" | "DESC"
      );

      // Apply pagination
      const offset = (page - 1) * limit;
      queryBuilder.skip(offset).take(limit);

      // Get paginated results
      const applications = await queryBuilder.getMany();

      // Get summary statistics
      const allApplications =
        await this.courierApplicationService[
          "courierApplicationRepository"
        ].find();

      const statusCounts = allApplications.reduce(
        (acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const workPeriodCounts = allApplications.reduce(
        (acc, app) => {
          acc[app.workPeriod] = (acc[app.workPeriod] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      // Calculate pagination info
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data: {
          applications: applications.map((app) => ({
            id: app.id,
            uid: app.uid,
            firstName: app.firstName,
            lastName: app.lastName,
            email: app.email,
            phone: app.phone,
            city: app.city,
            district: app.district,
            address: app.address,
            birthDate: app.birthDate,
            gender: app.gender,
            nationality: app.nationality,
            idNumber: app.idNumber,
            maritalStatus: app.maritalStatus,
            militaryStatus: app.militaryStatus,
            education: app.education,
            licenseClass: app.licenseClass,
            vehicleType: app.vehicleType,
            workPeriod: app.workPeriod,
            hasVehicle: app.hasVehicle,
            courierExperience: app.courierExperience,
            workExperiences: app.workExperiences,
            references: app.references,
            status: app.status,
            notes: app.notes,
            completionRate: 0, // TODO: Calculate from actual data
            createdAt: app.createdAt.toISOString(),
            updatedAt: app.updatedAt.toISOString(),
          })),
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
          summary: {
            totalApplications: allApplications.length,
            byStatus: statusCounts,
            byWorkPeriod: workPeriodCounts,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error;
    }
  }

  @Get("applications/statistics")
  @Roles("admin")
  @ApiOperation({ summary: "Get application statistics" })
  @ApiQuery({
    name: "period",
    required: false,
    type: String,
    description: "Time period: week, month, year, all",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Application statistics",
  })
  async getApplicationStatistics(
    @Query("period", new DefaultValuePipe("week"))
    period: "week" | "month" | "year" | "all"
  ): Promise<{
    success: boolean;
    data: {
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
        interviewed: number;
      }>;
    };
  }> {
    try {
      // Build date filter based on period
      const queryBuilder =
        this.courierApplicationService[
          "courierApplicationRepository"
        ].createQueryBuilder("application");

      if (period !== "all") {
        const now = new Date();
        let startDate: Date;

        switch (period) {
          case "week":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case "year":
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        }

        queryBuilder.where("application.createdAt >= :startDate", {
          startDate,
        });
      }

      const applications = await queryBuilder.getMany();
      const totalApplications = applications.length;

      // Calculate status distribution
      const statusCounts = applications.reduce(
        (acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const statusDistribution = Object.entries(statusCounts).map(
        ([status, count]) => ({
          status,
          count,
          percentage:
            totalApplications > 0 ? (count / totalApplications) * 100 : 0,
          label:
            status === "pending"
              ? "Beklemede"
              : status === "approved"
                ? "Onaylandı"
                : status === "rejected"
                  ? "Reddedildi"
                  : status === "interviewed"
                    ? "Görüşmeye Çağırıldı"
                    : status,
        })
      );

      // Calculate work period distribution
      const workPeriodCounts = applications.reduce(
        (acc, app) => {
          acc[app.workPeriod] = (acc[app.workPeriod] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const workPeriodDistribution = Object.entries(workPeriodCounts).map(
        ([workPeriod, count]) => ({
          workPeriod,
          count,
          percentage:
            totalApplications > 0 ? (count / totalApplications) * 100 : 0,
          label: workPeriod,
        })
      );

      // Calculate top cities
      const cityCounts = applications.reduce(
        (acc, app) => {
          if (app.city) {
            acc[app.city] = (acc[app.city] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>
      );

      const topCities = Object.entries(cityCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([city, count]) => ({
          city,
          count,
          percentage:
            totalApplications > 0 ? (count / totalApplications) * 100 : 0,
        }));

      // Calculate monthly trend (last 6 months)
      const monthlyTrend = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const monthApplications = applications.filter(
          (app) => app.createdAt >= monthStart && app.createdAt <= monthEnd
        );

        monthlyTrend.push({
          month: date.toLocaleDateString("tr-TR", { month: "long" }),
          count: monthApplications.length,
          approved: monthApplications.filter((app) => app.status === "approved")
            .length,
          rejected: monthApplications.filter((app) => app.status === "rejected")
            .length,
          interviewed: monthApplications.filter(
            (app) => app.status === "interviewed"
          ).length,
        });
      }

      return {
        success: true,
        data: {
          totalApplications,
          statusDistribution,
          workPeriodDistribution,
          averageCompletionRate: 0, // TODO: Calculate from actual data
          topCities,
          monthlyTrend,
        },
      };
    } catch (error) {
      console.error("Error fetching application statistics:", error);
      throw error;
    }
  }

  @Get("applications/:id")
  @Roles("admin")
  @ApiOperation({ summary: "Get application details by ID" })
  @ApiParam({ name: "id", description: "Application ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Application details",
  })
  async getApplicationById(@Param("id") id: string): Promise<{
    success: boolean;
    data: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      city: string;
      address: string;
      birthDate: string;
      gender: string;
      idNumber: string;
      nationality: string;
      education: string;
      licenseClass: string;
      vehicleType: string;
      workPeriod: string;
      workExperiences: string;
      courierExperience: string;
      notes: string;
      status: string;
      completionRate: number;
      createdAt: string;
      updatedAt: string;
      statusHistory: Array<{
        status: string;
        changedBy: string;
        changedAt: string;
        reason?: string;
      }>;
    };
  }> {
    try {
      const application = await this.courierApplicationService.findOne(id);

      return {
        success: true,
        data: {
          id: application.id,
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
          phone: application.phone,
          city: application.city,
          address: application.address || "",
          birthDate: application.birthDate || "",
          gender: application.gender || "",
          idNumber: application.idNumber || "",
          nationality: application.nationality || "",
          education: application.education || "",
          licenseClass: application.licenseClass || "",
          vehicleType: application.vehicleType || "",
          workPeriod: application.workPeriod,
          workExperiences: application.workExperiences || "",
          courierExperience: application.courierExperience || "",
          notes: application.notes || "",
          status: application.status,
          completionRate: 0, // TODO: Calculate from actual data
          createdAt: application.createdAt.toISOString(),
          updatedAt: application.updatedAt.toISOString(),
          statusHistory: [
            {
              status: application.status,
              changedBy: "system",
              changedAt: application.updatedAt.toISOString(),
              reason: "Database record",
            },
          ],
        },
      };
    } catch (error) {
      console.error("Error fetching application:", error);
      throw error;
    }
  }

  @Put("applications/:id/status")
  @Roles("admin")
  @ApiOperation({ summary: "Update application status" })
  @ApiParam({ name: "id", description: "Application ID" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Application status updated",
  })
  async updateApplicationStatus(
    @Param("id") id: string,
    @Body("status") status: string,
    @Body("reason") reason?: string,
    @CurrentUser() admin?: any
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      id: string;
      status: string;
      updatedAt: string;
    };
  }> {
    try {
      const validStatuses = ["pending", "approved", "rejected", "interviewed"];

      if (!validStatuses.includes(status)) {
        return {
          success: false,
          message: "Geçersiz durum",
          data: null,
        };
      }

      // Update the application status in database
      const updatedApplication = await this.courierApplicationService.update(
        id,
        {
          status,
          // TODO: Add reason to status history
        }
      );

      return {
        success: true,
        message: `Başvuru durumu "${status}" olarak güncellendi`,
        data: {
          id: updatedApplication.id,
          status: updatedApplication.status,
          updatedAt: updatedApplication.updatedAt.toISOString(),
        },
      };
    } catch (error) {
      console.error("Error updating application status:", error);
      return {
        success: false,
        message: "Durum güncellenirken hata oluştu",
        data: null,
      };
    }
  }

  @Get("applications/export")
  @Roles("admin")
  @ApiOperation({ summary: "Export applications to CSV" })
  @ApiQuery({
    name: "status",
    required: false,
    type: String,
    description: "Filter by status",
  })
  @ApiQuery({
    name: "workPeriod",
    required: false,
    type: String,
    description: "Filter by work period",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search term",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "CSV export data",
  })
  async exportApplications(
    @Query("status") status?: string,
    @Query("workPeriod") workPeriod?: string,
    @Query("search") search?: string
  ): Promise<{
    success: boolean;
    data: {
      filename: string;
      headers: string[];
      rows: string[][];
      count: number;
    };
  }> {
    try {
      // Build query conditions
      const queryBuilder =
        this.courierApplicationService[
          "courierApplicationRepository"
        ].createQueryBuilder("application");

      // Apply filters
      if (status) {
        queryBuilder.andWhere("application.status = :status", { status });
      }

      if (workPeriod) {
        queryBuilder.andWhere("application.workPeriod = :workPeriod", {
          workPeriod,
        });
      }

      if (search) {
        queryBuilder.andWhere(
          "(application.firstName ILIKE :search OR application.lastName ILIKE :search OR application.email ILIKE :search OR application.phone ILIKE :search)",
          { search: `%${search}%` }
        );
      }

      const applications = await queryBuilder.getMany();

      const headers = [
        "ID",
        "Ad",
        "Soyad",
        "E-posta",
        "Telefon",
        "Şehir",
        "Çalışma Periyodu",
        "Durum",
        "Başvuru Tarihi",
      ];

      const rows = applications.map((app) => [
        app.id,
        app.firstName,
        app.lastName,
        app.email,
        app.phone,
        app.city,
        app.workPeriod,
        app.status,
        app.createdAt.toISOString().split("T")[0],
      ]);

      const timestamp = new Date().toISOString().slice(0, 10);

      return {
        success: true,
        data: {
          filename: `basvurular_${timestamp}.csv`,
          headers,
          rows,
          count: rows.length,
        },
      };
    } catch (error) {
      console.error("Error exporting applications:", error);
      throw error;
    }
  }
}
