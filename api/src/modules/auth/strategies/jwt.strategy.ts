import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { SessionTrackingService } from "../session-tracking.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private sessionTrackingService: SessionTrackingService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET", "secretKey"),
    });
  }

  async validate(payload: any) {
    // Check if session is still active (if sessionId exists in payload)
    if (payload.sessionId) {
      const isSessionActive = this.sessionTrackingService.isSessionActive(
        payload.sessionId
      );
      if (!isSessionActive) {
        throw new UnauthorizedException(
          "Session has expired or been terminated"
        );
      }

      // Update session activity
      this.sessionTrackingService.updateActivity(payload.sessionId);
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sessionId,
    };
  }
}
