import redis from '../config/redis';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { Request, Response } from 'express';
import ActivityLogger from '../services/activityLoggerService';

interface RateLimiterOptions {
  windowMs?: number;
  max?: number;
}

const createRateLimiter = (options: RateLimiterOptions) => {
  const { windowMs = 15 * 60 * 1000, max = 100 } = options; // Default values

  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) => redis.sendCommand(args), // Use the Redis client's sendCommand method
      prefix: 'rate-limit:',
    }),
    windowMs, // Use the provided or default value
    max, // Use the provided or default value
    message: {
      error: 'Too many requests, please try again later.',
    },
    handler: (req: Request, res: Response) => {
      // Log the rate limit event
      ActivityLogger.log(req.user?.id ?? 0, 'RATE_LIMIT_EXCEEDED', {
        path: req.path,
        ip: req.ip,
      });

      // Send a 429 Too Many Requests response
      res.status(429).json({ error: 'Too many requests, please try again later.' });
    },
  });
};

export default createRateLimiter;