import { createClient } from 'redis';

const redis = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT || '6379'}`,
  password: process.env.REDIS_PASSWORD,
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

(async () => {
  await redis.connect();
})();

export default redis;