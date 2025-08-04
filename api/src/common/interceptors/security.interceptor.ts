import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { Request, Response } from "express";

@Injectable()
export class SecurityInterceptor implements NestInterceptor {
  private readonly logger = new Logger("SecurityInterceptor");
  private readonly suspiciousIPs = new Set<string>();
  private readonly failedAttempts = new Map<
    string,
    { count: number; lastAttempt: number }
  >();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // Security checks
    this.performSecurityChecks(request);
    this.addSecurityHeaders(response);

    const startTime = Date.now();

    return next.handle().pipe(
      tap((data) => {
        // Log successful authentication
        if (request.route?.path?.includes("login") && data?.access_token) {
          this.logger.log(
            `✅ Successful login from IP: ${this.getClientIp(request)}`
          );
          this.clearFailedAttempts(this.getClientIp(request));
        }
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        this.handleSecurityError(request, error, responseTime);
        return throwError(() => error);
      })
    );
  }

  private performSecurityChecks(request: Request) {
    const ip = this.getClientIp(request);
    const userAgent = request.headers["user-agent"] || "";

    // Check if IP is marked as suspicious
    if (this.suspiciousIPs.has(ip)) {
      throw new HttpException(
        "Access denied from suspicious IP",
        HttpStatus.FORBIDDEN
      );
    }

    // Check for malicious headers
    this.checkMaliciousHeaders(request);

    // Check user agent
    this.checkUserAgent(userAgent, ip);

    // Check for common attack patterns in URL
    this.checkUrlPatterns(request.url);

    // Check request size
    this.checkRequestSize(request);
  }

  private checkMaliciousHeaders(request: Request) {
    const suspiciousHeaders = [
      "x-forwarded-host",
      "x-rewrite-url",
      "x-original-url",
      "x-forwarded-proto",
    ];

    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i,
    ];

    for (const header of suspiciousHeaders) {
      const value = request.headers[header];
      if (typeof value === "string") {
        for (const pattern of maliciousPatterns) {
          if (pattern.test(value)) {
            this.logger.error(
              `🚨 Malicious header detected: ${header}=${value}`
            );
            throw new HttpException(
              "Malicious request detected",
              HttpStatus.BAD_REQUEST
            );
          }
        }
      }
    }
  }

  private checkUserAgent(userAgent: string, ip: string) {
    const maliciousPatterns = [
      /sqlmap/i,
      /nikto/i,
      /nessus/i,
      /openvas/i,
      /nmap/i,
      /masscan/i,
      /zap/i,
      /burp/i,
    ];

    if (maliciousPatterns.some((pattern) => pattern.test(userAgent))) {
      this.logger.error(`🚨 Malicious user agent from IP ${ip}: ${userAgent}`);
      this.suspiciousIPs.add(ip);
      throw new HttpException(
        "Suspicious user agent detected",
        HttpStatus.FORBIDDEN
      );
    }
  }

  private checkUrlPatterns(url: string) {
    const maliciousPatterns = [
      /\.\.\//, // Directory traversal
      /%2e%2e%2f/i, // Encoded directory traversal
      /\/etc\/passwd/,
      /\/proc\/version/,
      /<script/i,
      /javascript:/i,
      /union.*select/i, // SQL injection
      /1=1/,
      /admin['"]?\s*--/i,
    ];

    if (maliciousPatterns.some((pattern) => pattern.test(url))) {
      this.logger.error(`🚨 Malicious URL pattern detected: ${url}`);
      throw new HttpException(
        "Malicious URL pattern detected",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private checkRequestSize(request: Request) {
    const contentLength = parseInt(
      request.headers["content-length"] || "0",
      10
    );
    const maxSize = 1024 * 1024; // 1MB

    if (contentLength > maxSize) {
      this.logger.warn(
        `⚠️ Large request from IP ${this.getClientIp(request)}: ${contentLength} bytes`
      );
      throw new HttpException(
        "Request too large",
        HttpStatus.PAYLOAD_TOO_LARGE
      );
    }
  }

  private addSecurityHeaders(response: Response) {
    // Security headers
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("X-XSS-Protection", "1; mode=block");
    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    response.setHeader("X-DNS-Prefetch-Control", "off");
    response.setHeader("X-Download-Options", "noopen");
    response.setHeader("X-Permitted-Cross-Domain-Policies", "none");

    // Remove server information
    response.removeHeader("X-Powered-By");
    response.setHeader("Server", "WebServer");

    // HSTS (if HTTPS)
    if (response.req.secure) {
      response.setHeader(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains; preload"
      );
    }

    // CSP for auth endpoints
    if (response.req.url?.includes("/auth/")) {
      response.setHeader(
        "Content-Security-Policy",
        "default-src 'none'; script-src 'none'; object-src 'none'; frame-ancestors 'none';"
      );
    }
  }

  private handleSecurityError(
    request: Request,
    error: any,
    responseTime: number
  ) {
    const ip = this.getClientIp(request);

    // Track failed attempts
    if (error.status === HttpStatus.UNAUTHORIZED) {
      this.trackFailedAttempt(ip);
    }

    // Log security incident
    this.logger.error(
      `🔒 Security Error - IP: ${ip}, URL: ${request.url}, Error: ${error.message}, Response Time: ${responseTime}ms`
    );

    // Block IP after too many failed attempts
    const attempts = this.failedAttempts.get(ip);
    if (attempts && attempts.count >= 10) {
      this.suspiciousIPs.add(ip);
      this.logger.error(
        `🚨 IP ${ip} blocked after ${attempts.count} failed attempts`
      );
    }
  }

  private trackFailedAttempt(ip: string) {
    const now = Date.now();
    const attempts = this.failedAttempts.get(ip);

    if (!attempts) {
      this.failedAttempts.set(ip, { count: 1, lastAttempt: now });
    } else {
      // Reset count if last attempt was more than 1 hour ago
      if (now - attempts.lastAttempt > 60 * 60 * 1000) {
        this.failedAttempts.set(ip, { count: 1, lastAttempt: now });
      } else {
        attempts.count++;
        attempts.lastAttempt = now;
      }
    }
  }

  private clearFailedAttempts(ip: string) {
    this.failedAttempts.delete(ip);
    this.suspiciousIPs.delete(ip);
  }

  private getClientIp(request: Request): string {
    return (
      (request.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      (request.headers["x-real-ip"] as string) ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      (request.connection as any)?.socket?.remoteAddress ||
      "unknown"
    );
  }
}
