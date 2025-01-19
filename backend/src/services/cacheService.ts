import redis from '../config/redis';

interface CacheOptions {
  ttl?: number;
  tags?: string[];
}

class CacheService {
  static async get(key: string): Promise<any> {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  static async set(key: string, value: any, options: CacheOptions = {}): Promise<void> {
    const { ttl, tags = [] } = options;
    await redis.set(key, JSON.stringify(value));
    if (ttl) await redis.expire(key, ttl);

    // Store cache tags for invalidation
    for (const tag of tags) {
      await redis.sAdd(`tag:${tag}`, key);
    }
  }

  static async invalidateByTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      const keys = await redis.sMembers(`tag:${tag}`);
      if (keys.length) {
        await redis.del(keys);
        await redis.del(`tag:${tag}`);
      }
    }
  }
}

export default CacheService;
