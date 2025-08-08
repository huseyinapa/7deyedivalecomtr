import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { SessionTrackingService } from "./session-tracking.service";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";

interface LoginAttempt {
  email: string;
  ip: string;
  timestamp: Date;
  success: boolean;
  userAgent?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly loginAttempts: LoginAttempt[] = [];
  private readonly blockedAccounts = new Map<
    string,
    { until: Date; attempts: number }
  >();
  private readonly maxLoginAttempts = parseInt(
    process.env.MAX_LOGIN_ATTEMPTS || "5"
  ); // Production: 5 attempts
  private readonly lockoutDurationMs =
    parseInt(process.env.LOCKOUT_DURATION_MINUTES || "15") * 60 * 1000; // Production: 15 minutes

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private sessionTrackingService: SessionTrackingService
  ) {}

  async validateUser(
    email: string,
    password: string,
    ip?: string
  ): Promise<any> {
    try {
      // Check if account is locked
      if (this.isAccountLocked(email)) {
        const lockInfo = this.blockedAccounts.get(email);
        const remainingTime = Math.ceil(
          (lockInfo.until.getTime() - Date.now()) / 1000 / 60
        );
        throw new ForbiddenException(
          `Account locked due to too many failed attempts. Try again in ${remainingTime} minutes.`
        );
      }

      const user = await this.userService.findByEmail(email);

      if (!user) {
        this.logFailedAttempt(email, ip);
        throw new UnauthorizedException("Invalid credentials");
      }

      if (!user.isActive) {
        this.logFailedAttempt(email, ip);
        throw new ForbiddenException("Account is deactivated");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        this.logSuccessfulAttempt(email, ip);
        this.clearFailedAttempts(email);
        const { password, ...result } = user;
        return result;
      }

      this.logFailedAttempt(email, ip);
      this.checkAndLockAccount(email);
      throw new UnauthorizedException("Invalid credentials");
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      this.logger.error(`Authentication error for ${email}: ${error.message}`);
      this.logFailedAttempt(email, ip);
      throw new UnauthorizedException("Authentication failed");
    }
  }

  async login(loginDto: LoginDto, ip?: string, userAgent?: string) {
    // Input validation
    if (!loginDto.email || !loginDto.password) {
      throw new BadRequestException("Email and password are required");
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginDto.email)) {
      throw new BadRequestException("Invalid email format");
    }

    // Password strength check (minimum requirements)
    if (loginDto.password.length < 6) {
      throw new BadRequestException("Password too short");
    }

    const user = await this.validateUser(loginDto.email, loginDto.password, ip);

    // Create session
    const sessionId = this.sessionTrackingService.createSession(
      user.id,
      user.email,
      ip || "unknown",
      userAgent || "unknown"
    );

    // Generate secure JWT payload
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      sessionId, // Include session ID in JWT
      iat: Math.floor(Date.now() / 1000),
      jti: this.generateJti(), // JWT ID for token blacklisting
    };

    const accessToken = this.jwtService.sign(payload);

    // Log successful login
    this.logger.log(
      `✅ Successful login: ${user.email} from IP: ${ip || "unknown"}, Session: ${sessionId}`
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      accessToken,
      sessionId,
    };
  }

  private logFailedAttempt(email: string, ip?: string) {
    const attempt: LoginAttempt = {
      email,
      ip: ip || "unknown",
      timestamp: new Date(),
      success: false,
    };

    this.loginAttempts.push(attempt);
    this.cleanupOldAttempts();

    this.logger.warn(
      `❌ Failed login attempt: ${email} from IP: ${ip || "unknown"}`
    );
  }

  private logSuccessfulAttempt(email: string, ip?: string) {
    const attempt: LoginAttempt = {
      email,
      ip: ip || "unknown",
      timestamp: new Date(),
      success: true,
    };

    this.loginAttempts.push(attempt);
    this.cleanupOldAttempts();

    this.logger.log(
      `✅ Successful login: ${email} from IP: ${ip || "unknown"}`
    );
  }

  private checkAndLockAccount(email: string) {
    const recentFailedAttempts = this.getRecentFailedAttempts(email);

    if (recentFailedAttempts >= this.maxLoginAttempts) {
      const until = new Date(Date.now() + this.lockoutDurationMs);
      this.blockedAccounts.set(email, {
        until,
        attempts: recentFailedAttempts,
      });

      this.logger.error(
        `🔒 Account locked: ${email} after ${recentFailedAttempts} failed attempts`
      );
    }
  }

  private isAccountLocked(email: string): boolean {
    const lockInfo = this.blockedAccounts.get(email);
    if (!lockInfo) return false;

    if (Date.now() > lockInfo.until.getTime()) {
      this.blockedAccounts.delete(email);
      return false;
    }

    return true;
  }

  private getRecentFailedAttempts(email: string): number {
    const cutoff = new Date(Date.now() - this.lockoutDurationMs);
    return this.loginAttempts.filter(
      (attempt) =>
        attempt.email === email &&
        !attempt.success &&
        attempt.timestamp > cutoff
    ).length;
  }

  private clearFailedAttempts(email: string) {
    this.blockedAccounts.delete(email);
  }

  private cleanupOldAttempts() {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // Keep 24 hours
    const oldLength = this.loginAttempts.length;

    // Remove old attempts
    while (
      this.loginAttempts.length > 0 &&
      this.loginAttempts[0].timestamp < cutoff
    ) {
      this.loginAttempts.shift();
    }

    // Keep max 1000 recent attempts
    if (this.loginAttempts.length > 1000) {
      this.loginAttempts.splice(0, this.loginAttempts.length - 1000);
    }
  }

  private generateJti(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Admin methods for monitoring
  getLoginAttempts(limit: number = 100): LoginAttempt[] {
    return this.loginAttempts.slice(-limit).reverse();
  }

  getBlockedAccounts(): Array<{
    email: string;
    until: Date;
    attempts: number;
  }> {
    return Array.from(this.blockedAccounts.entries()).map(([email, info]) => ({
      email,
      ...info,
    }));
  }

  // Admin method to unlock account
  unlockAccount(email: string): boolean {
    if (this.blockedAccounts.has(email)) {
      this.blockedAccounts.delete(email);
      this.logger.log(`🔓 Account unlocked by admin: ${email}`);
      return true;
    }
    return false;
  }

  // Reset all login attempts and blocks (for development)
  resetAllAttempts(): void {
    this.loginAttempts.length = 0;
    this.blockedAccounts.clear();
    this.logger.log(`🔄 All login attempts and blocks reset`);
  }

  // Session tracking methods
  getSessionStats() {
    return this.sessionTrackingService.getSessionStats();
  }

  getActiveSessions() {
    return this.sessionTrackingService.getActiveSessions();
  }

  getUserSessions(userId: string) {
    return this.sessionTrackingService.getUserSessions(userId);
  }

  endSession(sessionId: string) {
    return this.sessionTrackingService.endSession(sessionId);
  }

  endAllUserSessions(userId: string) {
    return this.sessionTrackingService.endAllUserSessions(userId);
  }

  updateSessionActivity(sessionId: string) {
    return this.sessionTrackingService.updateActivity(sessionId);
  }

  // Admin methods for security monitoring
  getBlockedIPs(): string[] {
    // Simple implementation - can be enhanced with database storage
    const blockedIPs = new Set<string>();

    // Get IPs with multiple failed attempts in the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentFailures = this.loginAttempts.filter(
      (attempt) => !attempt.success && attempt.timestamp > oneHourAgo
    );

    // Group by IP and count failures
    const ipFailureCounts = new Map<string, number>();
    recentFailures.forEach((attempt) => {
      const count = ipFailureCounts.get(attempt.ip) || 0;
      ipFailureCounts.set(attempt.ip, count + 1);
    });

    // Consider IPs with 3+ failures as blocked
    ipFailureCounts.forEach((count, ip) => {
      if (count >= 3) {
        blockedIPs.add(ip);
      }
    });

    return Array.from(blockedIPs);
  }
}
