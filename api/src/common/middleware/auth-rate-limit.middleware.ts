import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

interface RateLimitData {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockUntil?: number;
}

@Injectable()
export class AuthRateLimitMiddleware implements NestMiddleware {
  private readonly attempts = new Map<string, RateLimitData>();
  private readonly maxAttempts = 5; // Max 5 attempts
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly blockDurationMs = 60 * 60 * 1000; // 1 hour block

  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = this.getClientIp(req);
    const now = Date.now();

    // Clean up expired entries
    this.cleanup(now);

    const rateLimitData = this.attempts.get(clientIp);

    // Check if IP is currently blocked
    if (
      rateLimitData?.blocked &&
      rateLimitData.blockUntil &&
      now < rateLimitData.blockUntil
    ) {
      const remainingTime = Math.ceil(
        (rateLimitData.blockUntil - now) / 1000 / 60
      );
      throw new HttpException(
        {
          message: `IP blocked due to too many failed attempts. Try again in ${remainingTime} minutes.`,
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: "Too Many Requests",
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    // Initialize or reset if window expired
    if (!rateLimitData || now > rateLimitData.resetTime) {
      this.attempts.set(clientIp, {
        count: 1,
        resetTime: now + this.windowMs,
        blocked: false,
      });
    } else {
      rateLimitData.count++;

      // Block IP if max attempts exceeded
      if (rateLimitData.count > this.maxAttempts) {
        rateLimitData.blocked = true;
        rateLimitData.blockUntil = now + this.blockDurationMs;

        throw new HttpException(
          {
            message:
              "Too many authentication attempts. IP has been temporarily blocked.",
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            error: "Too Many Requests",
          },
          HttpStatus.TOO_MANY_REQUESTS
        );
      }
    }

    // Add rate limit headers
    const remaining = Math.max(
      0,
      this.maxAttempts - (rateLimitData?.count || 0)
    );
    res.setHeader("X-RateLimit-Limit", this.maxAttempts);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader(
      "X-RateLimit-Reset",
      rateLimitData?.resetTime || now + this.windowMs
    );

    next();
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

  private cleanup(now: number) {
    for (const [ip, data] of this.attempts.entries()) {
      if (data.blocked && data.blockUntil && now > data.blockUntil) {
        this.attempts.delete(ip);
      } else if (!data.blocked && now > data.resetTime) {
        this.attempts.delete(ip);
      }
    }
  }

  // Method to clear rate limit for an IP (useful for admin actions)
  clearRateLimit(ip: string) {
    this.attempts.delete(ip);
  }

  // Method to get current rate limit status
  getRateLimitStatus(ip: string): RateLimitData | null {
    return this.attempts.get(ip) || null;
  }
}
