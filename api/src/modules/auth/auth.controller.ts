import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Req,
  Res,
  Logger,
  Get,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UsersService } from "../users/users.service";
import { Public } from "./decorators/public.decorator";
import { SecurityInterceptor } from "../../common/interceptors/security.interceptor";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@ApiTags("auth")
@Controller("auth")
@UseInterceptors(SecurityInterceptor)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login with email and password" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User has been successfully logged in",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Invalid credentials",
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: "Too many login attempts",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Account locked or IP blocked",
  })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const clientIp = this.getClientIp(req);
    const userAgent = req.headers["user-agent"] || "Unknown";

    try {
      this.logger.log(
        `Login attempt from IP: ${clientIp}, Email: ${loginDto.email}`
      );

      const result = await this.authService.login(
        loginDto,
        clientIp,
        userAgent
      );

      this.logger.log(
        `✅ Login successful for ${loginDto.email} from IP: ${clientIp}`
      );

      // Set secure cookie
      res.cookie("access_token", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      return res.json({
        success: true,
        message: "Login successful",
        data: {
          user: result.user,
          access_token: result.accessToken,
        },
      });
    } catch (error) {
      this.logger.error(
        `❌ Login failed for ${loginDto.email} from IP: ${clientIp}: ${error.message}`
      );
      throw error;
    }
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Current user profile",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Invalid or expired token",
  })
  async getProfile(@CurrentUser() user: any, @Req() req: Request) {
    const clientIp = this.getClientIp(req);

    this.logger.log(`Profile access from IP: ${clientIp}, User: ${user.email}`);

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    };
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Logout current user" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User logged out successfully",
  })
  async logout(
    @CurrentUser() user: any,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const clientIp = this.getClientIp(req);

    this.logger.log(`Logout from IP: ${clientIp}, User: ${user.email}`);

    // Clear cookie
    res.clearCookie("access_token");

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  }

  private getClientIp(req: Request): string {
    return (
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      (req.headers["x-real-ip"] as string) ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection as any)?.socket?.remoteAddress ||
      "unknown"
    );
  }
}
