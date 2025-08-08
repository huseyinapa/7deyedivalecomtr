import { Injectable, Logger } from "@nestjs/common";

export interface UserSession {
  sessionId: string;
  userId: string;
  email: string;
  ip: string;
  userAgent: string;
  loginTime: Date;
  lastActivity: Date;
  isActive: boolean;
}

@Injectable()
export class SessionTrackingService {
  private readonly logger = new Logger(SessionTrackingService.name);
  private readonly activeSessions = new Map<string, UserSession>();
  private readonly userSessions = new Map<string, Set<string>>(); // userId -> sessionIds

  /**
   * Create a new session when user logs in
   */
  createSession(
    userId: string,
    email: string,
    ip: string,
    userAgent: string
  ): string {
    const sessionId = this.generateSessionId();
    const now = new Date();

    const session: UserSession = {
      sessionId,
      userId,
      email,
      ip,
      userAgent,
      loginTime: now,
      lastActivity: now,
      isActive: true,
    };

    this.activeSessions.set(sessionId, session);

    // Track user sessions
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, new Set());
    }
    this.userSessions.get(userId)!.add(sessionId);

    this.logger.log(
      `✅ New session created: ${sessionId} for user ${email} from IP ${ip}`
    );
    this.cleanupOldSessions();

    return sessionId;
  }

  /**
   * Update session activity
   */
  updateActivity(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (session && session.isActive) {
      session.lastActivity = new Date();
    }
  }

  /**
   * End a session (logout)
   */
  endSession(sessionId: string): void {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.isActive = false;
      this.activeSessions.delete(sessionId);

      // Remove from user sessions
      const userSessions = this.userSessions.get(session.userId);
      if (userSessions) {
        userSessions.delete(sessionId);
        if (userSessions.size === 0) {
          this.userSessions.delete(session.userId);
        }
      }

      this.logger.log(
        `🔚 Session ended: ${sessionId} for user ${session.email}`
      );
    }
  }

  /**
   * End all sessions for a user
   */
  endAllUserSessions(userId: string): void {
    const sessionIds = this.userSessions.get(userId);
    if (sessionIds) {
      sessionIds.forEach((sessionId) => {
        this.activeSessions.delete(sessionId);
      });
      this.userSessions.delete(userId);
      this.logger.log(`🔚 All sessions ended for user: ${userId}`);
    }
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): UserSession[] {
    return Array.from(this.activeSessions.values()).filter(
      (session) => session.isActive
    );
  }

  /**
   * Get active sessions for a specific user
   */
  getUserSessions(userId: string): UserSession[] {
    const sessionIds = this.userSessions.get(userId);
    if (!sessionIds) return [];

    return Array.from(sessionIds)
      .map((sessionId) => this.activeSessions.get(sessionId))
      .filter(
        (session): session is UserSession =>
          session !== undefined && session.isActive
      );
  }

  /**
   * Get total active users count
   */
  getActiveUsersCount(): number {
    return this.userSessions.size;
  }

  /**
   * Get total active sessions count
   */
  getActiveSessionsCount(): number {
    return this.activeSessions.size;
  }

  /**
   * Get session statistics
   */
  getSessionStats() {
    const now = new Date();
    const sessions = this.getActiveSessions();

    // Sessions in last 5 minutes
    const recentSessions = sessions.filter(
      (session) =>
        now.getTime() - session.lastActivity.getTime() < 5 * 60 * 1000
    );

    // Sessions in last hour
    const hourSessions = sessions.filter(
      (session) =>
        now.getTime() - session.lastActivity.getTime() < 60 * 60 * 1000
    );

    return {
      totalActiveSessions: sessions.length,
      totalActiveUsers: this.getActiveUsersCount(),
      recentlyActiveSessions: recentSessions.length,
      sessionsLastHour: hourSessions.length,
      averageSessionDuration: this.calculateAverageSessionDuration(sessions),
    };
  }

  /**
   * Check if session exists and is active
   */
  isSessionActive(sessionId: string): boolean {
    const session = this.activeSessions.get(sessionId);
    return session?.isActive === true;
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): UserSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private calculateAverageSessionDuration(sessions: UserSession[]): number {
    if (sessions.length === 0) return 0;

    const totalDuration = sessions.reduce((sum, session) => {
      return (
        sum + (session.lastActivity.getTime() - session.loginTime.getTime())
      );
    }, 0);

    return Math.round(totalDuration / sessions.length / 1000 / 60); // minutes
  }

  private cleanupOldSessions(): void {
    const now = new Date();
    const maxInactiveTime = 24 * 60 * 60 * 1000; // 24 hours

    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (now.getTime() - session.lastActivity.getTime() > maxInactiveTime) {
        this.endSession(sessionId);
      }
    }

    // Keep only last 1000 sessions in memory
    if (this.activeSessions.size > 1000) {
      const sessions = Array.from(this.activeSessions.entries()).sort(
        ([, a], [, b]) => a.lastActivity.getTime() - b.lastActivity.getTime()
      );

      const toRemove = sessions.slice(0, sessions.length - 1000);
      toRemove.forEach(([sessionId]) => {
        this.endSession(sessionId);
      });
    }
  }
}
