import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Request } from "express";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: "email",
      passReqToCallback: true, // Enable request object in validate
    });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    const clientIp = this.getClientIp(req);
    const userAgent = req.headers["user-agent"];

    const user = await this.authService.validateUser(email, password, clientIp);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return user;
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
