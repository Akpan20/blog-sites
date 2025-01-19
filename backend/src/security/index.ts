import { randomBytes, scrypt } from 'crypto';
import { Request, Response, NextFunction } from 'express';

class SecurityService {
  // Hash a password using scrypt
  static async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    return new Promise((resolve, reject) => {
      scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(salt + ':' + derivedKey.toString('hex'));
      });
    });
  }

  // Generate a secure token
  static generateSecureToken(): string {
    return randomBytes(32).toString('hex');
  }

  // Set up security headers
  static setupSecurityHeaders(app: any) {
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      res.setHeader('Content-Security-Policy', "default-src 'self'");
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      next();
    });
  }

  // Rate limiting middleware
  static rateLimit(options: { windowMs?: number; max?: number } = {}) {
    const ipRequests = new Map<string, number[]>();

    return (req: Request, res: Response, next: NextFunction) => {
      const ip = req.ip || '0.0.0.0';
      const now = Date.now();
      const windowMs = options.windowMs || 60000; // Default: 1 minute
      const maxRequests = options.max || 100; // Default: 100 requests per window

      const requestTimestamps = ipRequests.get(ip) || [];
      const windowStart = now - windowMs;

      // Clean old requests
      const validRequests = requestTimestamps.filter((timestamp) => timestamp > windowStart);

      if (validRequests.length >= maxRequests) {
        return res.status(429).json({
          error: 'Too many requests, please try again later.',
        });
      }

      validRequests.push(now);
      ipRequests.set(ip, validRequests);
      next();
    };
  }
}

export default SecurityService;