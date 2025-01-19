import { Pool } from 'pg';
import UserActivity from '../models/UserActivity';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

class RecommendationService {
  static async generateUserProfile(userId: string) {
    // Collect user interactions
    const interactions = await UserActivity.find({
      user_id: userId,
      action: ['VIEW', 'LIKE', 'COMMENT']
    });

    // Extract user interests
    return this.analyzeInteractions(interactions);
  }

  static analyzeInteractions(interactions: any[]) {
    // Example logic to analyze interactions and extract interests
    const interests = interactions.reduce((acc, interaction) => {
      // Process interactions and extract interests
      return acc;
    }, {});

    return { interests };
  }

  static async getRecommendations(userId: string) {
    const userProfile = await this.generateUserProfile(userId);

    const query = {
      text: `
        WITH user_interests AS (
          SELECT category_id, COUNT(*) as interest_weight
          FROM user_activities ua
          JOIN posts p ON ua.post_id = p.id
          WHERE ua.user_id = $1
          GROUP BY category_id
        )
        SELECT p.*, 
               similarity(p.tags, $2) as tag_similarity,
               ui.interest_weight
        FROM posts p
        LEFT JOIN user_interests ui ON p.category_id = ui.category_id
        WHERE p.id NOT IN (
          SELECT post_id FROM user_activities 
          WHERE user_id = $1 AND action = 'VIEW'
        )
        ORDER BY (tag_similarity * COALESCE(ui.interest_weight, 1)) DESC
        LIMIT 10
      `,
      values: [userId, userProfile.interests]
    };

    return pool.query(query);
  }
}
