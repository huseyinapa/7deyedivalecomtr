import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthService } from "../auth/auth.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";

@ApiTags("admin")
@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly authService: AuthService) {}

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
    // Mock statistics for now
    return {
      success: true,
      data: {
        totalUsers: 1,
        totalApplications: 0,
        totalCalls: 0,
        totalServices: 0,
        recentLogins: 1,
        activeUsers: 1,
      },
    };
  }

  @Get("trends")
  @Roles("admin")
  @ApiOperation({ summary: "Get admin dashboard trends" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Admin trends retrieved successfully",
  })
  async getTrends(@Query("period") period?: string, @CurrentUser() user?: any) {
    // Mock trends data for now
    return {
      success: true,
      data: [
        {
          date: new Date().toISOString().split("T")[0],
          users: 1,
          applications: 0,
          calls: 0,
        },
      ],
    };
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
}
