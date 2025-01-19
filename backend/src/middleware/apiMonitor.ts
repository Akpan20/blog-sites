import redis from '../config/redis';
import { Request, Response, NextFunction } from 'express';
import ActivityLogger from '../services/activityLoggerService';

const apiMonitor = async (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', async () => {
    const duration = Date.now() - start;

    const metrics = {
      path: req.path,
      method: req.method,
      status: res.statusCode,
      duration,
      userId: req.user?.id,
      timestamp: new Date(),
    };

    try {
      // Store metrics in Redis for real-time monitoring
      await redis.lPush('api:metrics', JSON.stringify(metrics));

      // Aggregate metrics for dashboard
      const key = `metrics:${req.path}:${new Date().toISOString().split('T')[0]}`;
      await redis.hIncrBy(key, 'count', 1);
      await redis.hIncrBy(key, 'totalDuration', duration);

      // Alert on slow requests
      if (duration > 1000) {
        await ActivityLogger.log(0, 'SLOW_REQUEST', metrics);
      }
    } catch (error) {
      console.error('Error logging API metrics:', error);
    }
  });

  next();
};

export default apiMonitor;