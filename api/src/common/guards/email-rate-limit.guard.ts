import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class EmailRateLimitGuard implements CanActivate {
  private readonly emailAttempts = new Map<
    string,
    { count: number; resetTime: number }
  >();
  private readonly ipAttempts = new Map<
    string,
    { count: number; resetTime: number }
  >();

  // Email bazlı: 3 başvuru / 24 saat (daha esnek)
  private readonly emailLimit = 3;
  private readonly emailWindow = 24 * 60 * 60 * 1000; // 24 hours

  // IP bazlı: 5 başvuru / 2 saat (aynı ofis/okul durumu için)
  private readonly ipLimit = 5;
  private readonly ipWindow = 2 * 60 * 60 * 1000; // 2 hours

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const email = request.body?.email;
    const ip = this.getClientIp(request);
    const now = Date.now();

    // Cleanup expired entries
    this.cleanup(now);

    // Check email-based rate limit
    if (email) {
      const emailKey = email.toLowerCase();
      const emailData = this.emailAttempts.get(emailKey);

      if (
        emailData &&
        now < emailData.resetTime &&
        emailData.count >= this.emailLimit
      ) {
        const remainingHours = Math.ceil(
          (emailData.resetTime - now) / (1000 * 60 * 60)
        );
        throw new HttpException(
          {
            message: `Bu email adresi ile bugün ${this.emailLimit} başvuru yapılmış. ${remainingHours} saat sonra tekrar deneyebilirsiniz.`,
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            error: "Too Many Requests",
            details: {
              usedAttempts: emailData.count,
              maxAttempts: this.emailLimit,
              resetIn: remainingHours + " saat",
            },
          },
          HttpStatus.TOO_MANY_REQUESTS
        );
      }

      // Update email attempts
      if (!emailData || now >= emailData.resetTime) {
        this.emailAttempts.set(emailKey, {
          count: 1,
          resetTime: now + this.emailWindow,
        });
      } else {
        emailData.count++;
      }
    }

    // Check IP-based rate limit (for shared networks)
    const ipData = this.ipAttempts.get(ip);

    if (ipData && now < ipData.resetTime && ipData.count >= this.ipLimit) {
      const remainingMinutes = Math.ceil(
        (ipData.resetTime - now) / (1000 * 60)
      );
      throw new HttpException(
        {
          message: `Bu IP adresinden çok fazla başvuru yapılmış. ${remainingMinutes} dakika sonra tekrar deneyebilirsiniz.`,
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: "Too Many Requests",
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    // Update IP attempts
    if (!ipData || now >= ipData.resetTime) {
      this.ipAttempts.set(ip, { count: 1, resetTime: now + this.ipWindow });
    } else {
      ipData.count++;
    }

    return true;
  }

  private getClientIp(request: Request): string {
    return (
      (request.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      (request.headers["x-real-ip"] as string) ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      "unknown"
    );
  }

  private cleanup(now: number) {
    // Cleanup email attempts
    for (const [email, data] of this.emailAttempts.entries()) {
      if (now >= data.resetTime) {
        this.emailAttempts.delete(email);
      }
    }

    // Cleanup IP attempts
    for (const [ip, data] of this.ipAttempts.entries()) {
      if (now >= data.resetTime) {
        this.ipAttempts.delete(ip);
      }
    }
  }

  // Check remaining attempts (for frontend)
  getRemainingAttempts(email: string, ip: string) {
    const now = Date.now();
    const emailKey = email.toLowerCase();
    const emailData = this.emailAttempts.get(emailKey);
    const ipData = this.ipAttempts.get(ip);

    return {
      email: {
        remaining:
          emailData && now < emailData.resetTime
            ? Math.max(0, this.emailLimit - emailData.count)
            : this.emailLimit,
        resetIn:
          emailData && now < emailData.resetTime
            ? Math.ceil((emailData.resetTime - now) / (1000 * 60 * 60))
            : 0,
      },
      ip: {
        remaining:
          ipData && now < ipData.resetTime
            ? Math.max(0, this.ipLimit - ipData.count)
            : this.ipLimit,
        resetIn:
          ipData && now < ipData.resetTime
            ? Math.ceil((ipData.resetTime - now) / (1000 * 60))
            : 0,
      },
    };
  }
}
