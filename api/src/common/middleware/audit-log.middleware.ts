import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

interface AuditLog {
  timestamp: Date;
  ip: string;
  userAgent: string;
  endpoint: string;
  method: string;
  email?: string;
  success?: boolean;
  errorMessage?: string;
  userId?: string;
}

@Injectable()
export class AuditLogMiddleware implements NestMiddleware {
  private readonly logger = new Logger("AuditLog");
  private readonly auditLogs: AuditLog[] = [];

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const ip = this.getClientIp(req);
    const userAgent = req.headers["user-agent"] || "Unknown";

    // Log request
    const auditEntry: AuditLog = {
      timestamp: new Date(),
      ip,
      userAgent,
      endpoint: req.originalUrl,
      method: req.method,
      email: req.body?.email || undefined,
    };

    // Use response.on('finish') event instead of overriding end
    res.on("finish", () => {
      const responseTime = Date.now() - startTime;

      // Determine if request was successful
      auditEntry.success = res.statusCode < 400;

      if (!auditEntry.success && res.statusCode === 401) {
        auditEntry.errorMessage = "Invalid credentials";
      } else if (!auditEntry.success) {
        auditEntry.errorMessage = `HTTP ${res.statusCode}`;
      }

      // Log to console and store
      this.logAuditEntry(auditEntry, responseTime);
      this.storeAuditEntry(auditEntry);
    });

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

  private logAuditEntry(entry: AuditLog, responseTime: number) {
    const logMessage = [
      `IP: ${entry.ip}`,
      `Method: ${entry.method}`,
      `Endpoint: ${entry.endpoint}`,
      `Email: ${entry.email || "N/A"}`,
      `Success: ${entry.success}`,
      `Response Time: ${responseTime}ms`,
      entry.errorMessage ? `Error: ${entry.errorMessage}` : "",
      `User Agent: ${entry.userAgent.substring(0, 100)}...`,
    ]
      .filter(Boolean)
      .join(" | ");

    if (entry.success) {
      this.logger.log(`✅ ${logMessage}`);
    } else {
      this.logger.warn(`❌ ${logMessage}`);
    }

    // Alert on suspicious activity
    if (this.isSuspiciousActivity(entry)) {
      this.logger.error(`🚨 SUSPICIOUS ACTIVITY DETECTED: ${logMessage}`);
    }
  }

  private storeAuditEntry(entry: AuditLog) {
    this.auditLogs.push(entry);

    // Keep only last 1000 entries in memory
    if (this.auditLogs.length > 1000) {
      this.auditLogs.shift();
    }
  }

  private isSuspiciousActivity(entry: AuditLog): boolean {
    const recentLogs = this.auditLogs.filter(
      (log) =>
        log.ip === entry.ip &&
        Date.now() - log.timestamp.getTime() < 5 * 60 * 1000 // Last 5 minutes
    );

    // More than 10 failed attempts in 5 minutes
    if (recentLogs.filter((log) => !log.success).length > 10) {
      return true;
    }

    // Different emails from same IP in short time
    const uniqueEmails = new Set(
      recentLogs.map((log) => log.email).filter(Boolean)
    );
    if (uniqueEmails.size > 5) {
      return true;
    }

    // Suspicious user agents
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /requests/i,
    ];

    if (suspiciousPatterns.some((pattern) => pattern.test(entry.userAgent))) {
      return true;
    }

    return false;
  }

  // Get audit logs for admin dashboard
  getAuditLogs(limit: number = 100): AuditLog[] {
    return this.auditLogs.slice(-limit).reverse();
  }

  // Get failed login attempts for specific IP
  getFailedAttempts(ip: string, minutes: number = 15): AuditLog[] {
    const cutoff = Date.now() - minutes * 60 * 1000;
    return this.auditLogs.filter(
      (log) => log.ip === ip && !log.success && log.timestamp.getTime() > cutoff
    );
  }
}
