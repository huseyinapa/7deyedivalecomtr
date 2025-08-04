/**
 * Rate limiting utility for admin actions
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private storage = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if action is rate limited
   */
  isRateLimited(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.storage.get(key);

    if (!entry || now > entry.resetTime) {
      // Create new entry
      this.storage.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return false;
    }

    if (entry.count >= limit) {
      return true;
    }

    // Increment counter
    entry.count++;
    return false;
  }

  /**
   * Get remaining attempts
   */
  getRemainingAttempts(key: string, limit: number): number {
    const entry = this.storage.get(key);
    if (!entry || Date.now() > entry.resetTime) {
      return limit;
    }
    return Math.max(0, limit - entry.count);
  }

  /**
   * Get time until reset
   */
  getTimeUntilReset(key: string): number {
    const entry = this.storage.get(key);
    if (!entry) return 0;
    return Math.max(0, entry.resetTime - Date.now());
  }

  /**
   * Clear rate limit for a key
   */
  clear(key: string): void {
    this.storage.delete(key);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.storage.entries()) {
      if (now > entry.resetTime) {
        this.storage.delete(key);
      }
    }
  }

  /**
   * Destroy the rate limiter
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.storage.clear();
  }
}

// Global rate limiter instance
const rateLimiter = new RateLimiter();

// Rate limiting presets
export const RATE_LIMITS = {
  LOGIN: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  ADMIN_ACTION: { limit: 100, windowMs: 60 * 1000 }, // 100 actions per minute
  API_CALL: { limit: 1000, windowMs: 60 * 1000 }, // 1000 calls per minute
} as const;

/**
 * Check if an action is rate limited
 */
export function checkRateLimit(
  key: string,
  type: keyof typeof RATE_LIMITS
): { isLimited: boolean; remaining: number; resetTime: number } {
  const { limit, windowMs } = RATE_LIMITS[type];
  const isLimited = rateLimiter.isRateLimited(key, limit, windowMs);
  const remaining = rateLimiter.getRemainingAttempts(key, limit);
  const resetTime = rateLimiter.getTimeUntilReset(key);

  return { isLimited, remaining, resetTime };
}

/**
 * Clear rate limit for a key
 */
export function clearRateLimit(key: string): void {
  rateLimiter.clear(key);
}

export default rateLimiter;
