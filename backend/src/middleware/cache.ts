import { Request, Response, NextFunction } from 'express';
import { createClient } from 'redis';

// Initialize Redis client
const redisClient = createClient();

(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

// Graceful shutdown for Redis
process.on('SIGINT', async () => {
  try {
    await redisClient.quit();
    console.log('Redis client disconnected');
    process.exit(0);
  } catch (err) {
    console.error('Error disconnecting from Redis:', err);
    process.exit(1);
  }
});

const cacheMiddleware = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = `__express__${req.originalUrl || req.url}`;

    try {
      const cachedResponse = await redisClient.get(key);

      if (cachedResponse) {
        const parsedResponse = JSON.parse(cachedResponse);
        if (typeof parsedResponse === 'object' && parsedResponse !== null) {
          res.json(parsedResponse); // Send cached response
          return; // Exit the middleware early
        }
      }

      const originalJson: typeof res.json = res.json;

      res.json = function (body: object | string | number | boolean | null): Response {
        redisClient
          .setEx(key, duration, JSON.stringify(body))
          .catch((err) => console.error('Error caching response:', err));

        return originalJson.call(this, body);
      };

      next(); // Continue to next middleware/route
    } catch (error) {
      next(error); // Pass error to Express error handler
    }
  };
};

export default cacheMiddleware;