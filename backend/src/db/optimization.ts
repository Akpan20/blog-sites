import pool from "./pool";

const DatabaseOptimizer = {
  async analyze() {
    const queries = [
      'ANALYZE VERBOSE users',
      'ANALYZE VERBOSE posts',
      'ANALYZE VERBOSE comments'
    ];

    for (const query of queries) {
      await pool.query(query);
    }
  },

  async vacuum() {
    const tables = ['users', 'posts', 'comments'];
    for (const table of tables) {
      await pool.query(`VACUUM ANALYZE ${table}`);
    }
  },

  async createIndexes() {
    const indexes = [
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_created_at 
       ON posts (created_at DESC)`,
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_posts_user_category 
       ON posts (user_id, category_id)`,
      `CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_comments_post_created 
       ON comments (post_id, created_at DESC)`
    ];

    for (const index of indexes) {
      await pool.query(index);
    }
  }
};