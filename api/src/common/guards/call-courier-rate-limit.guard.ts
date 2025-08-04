import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class CallCourierRateLimitGuard implements CanActivate {
  private readonly phoneAttempts = new Map<
    string,
    { count: number; resetTime: number }
  >();
  private readonly ipAttempts = new Map<
    string,
    { count: number; resetTime: number }
  >();

  // Telefon bazlı: 5 çağrı / 2 saat (daha esnek)
  private readonly phoneLimit = 5;
  private readonly phoneWindow = 2 * 60 * 60 * 1000; // 2 hours

  // IP bazlı: 8 çağrı / 1 saat (ofis durumu için)
  private readonly ipLimit = 8;
  private readonly ipWindow = 60 * 60 * 1000; // 1 hour

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const senderPhone = request.body?.senderPhone;
    const ip = this.getClientIp(request);
    const now = Date.now();

    // Cleanup expired entries
    this.cleanup(now);

    // Check phone-based rate limit
    if (senderPhone) {
      const phoneKey = senderPhone.replace(/\D/g, ""); // Remove non-digits
      const phoneData = this.phoneAttempts.get(phoneKey);

      if (
        phoneData &&
        now < phoneData.resetTime &&
        phoneData.count >= this.phoneLimit
      ) {
        const remainingMinutes = Math.ceil(
          (phoneData.resetTime - now) / (1000 * 60)
        );
        throw new HttpException(
          {
            message: `Bu telefon numarası ile çok fazla kurye çağrısı yapılmış. ${remainingMinutes} dakika sonra tekrar deneyebilirsiniz.`,
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            error: "Too Many Requests",
          },
          HttpStatus.TOO_MANY_REQUESTS
        );
      }

      // Update phone attempts
      if (!phoneData || now >= phoneData.resetTime) {
        this.phoneAttempts.set(phoneKey, {
          count: 1,
          resetTime: now + this.phoneWindow,
        });
      } else {
        phoneData.count++;
      }
    }

    // Check IP-based rate limit
    const ipData = this.ipAttempts.get(ip);

    if (ipData && now < ipData.resetTime && ipData.count >= this.ipLimit) {
      const remainingMinutes = Math.ceil(
        (ipData.resetTime - now) / (1000 * 60)
      );
      throw new HttpException(
        {
          message: `Bu IP adresinden çok fazla kurye çağrısı yapılmış. ${remainingMinutes} dakika sonra tekrar deneyebilirsiniz.`,
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
    // Cleanup phone attempts
    for (const [phone, data] of this.phoneAttempts.entries()) {
      if (now >= data.resetTime) {
        this.phoneAttempts.delete(phone);
      }
    }

    // Cleanup IP attempts
    for (const [ip, data] of this.ipAttempts.entries()) {
      if (now >= data.resetTime) {
        this.ipAttempts.delete(ip);
      }
    }
  }
}
