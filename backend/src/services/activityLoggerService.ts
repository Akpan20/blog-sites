import { sequelize } from '../config/database';
import { createClient } from 'redis';

// Initialize Redis client
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

// Connect to Redis
redis.connect();

// Define ActivityLogger
const ActivityLogger = {
  // Log user activity
  async log(userId: number, action: string, details: Record<string, any>) {
    const query = `
      INSERT INTO user_activities (user_id, action, details)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [userId, action, details];

    // Store in PostgreSQL for persistence
    await sequelize.query(query, { replacements: values });

    // Cache in Redis for quick access
    const key = `user:${userId}:activities`;
    await redis.lPush(key, JSON.stringify({ action, details, timestamp: new Date() }));
    await redis.lTrim(key, 0, 99); // Keep last 100 activities
  },

  // Get user activity
  async getUserActivity(userId: number, limit: number = 20) {
    const query = `
      SELECT *
      FROM user_activities
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    const values = [userId, limit];

    // Fetch from PostgreSQL
    return sequelize.query(query, { replacements: values });
  },
};

export default ActivityLogger;