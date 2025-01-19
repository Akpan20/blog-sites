import express, { Request, Response } from 'express';
import pool from '../db/pool';

export const searchPosts = async (req: Request, res: Response) => {
  try {
    const { q, category, tag, startDate, endDate, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const query = {
      text: `
        SELECT p.*, u.username,
          COUNT(*) OVER() as total_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN post_tags pt ON pt.post_id = p.id
        WHERE 
          ($1::text IS NULL OR p.title ILIKE $1 OR p.content ILIKE $1)
          AND ($2::text IS NULL OR p.category = $2)
          AND ($3::text IS NULL OR pt.tag = $3)
          AND ($4::timestamp IS NULL OR p.created_at >= $4)
          AND ($5::timestamp IS NULL OR p.created_at <= $5)
        GROUP BY p.id, u.username
        ORDER BY p.created_at DESC
        LIMIT $6 OFFSET $7
      `,
      values: [
        q ? `%${q}%` : null,
        category,
        tag,
        startDate,
        endDate,
        limit,
        offset,
      ],
    };

    const { rows } = await pool.query(query);
    const totalCount = rows[0]?.total_count || 0;

    res.json({
      posts: rows,
      pagination: {
        total: parseInt(totalCount),
        pages: Math.ceil(totalCount / Number(limit)),
        current: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Attach to router
const router = express.Router();
router.get('/search', searchPosts);
export default router;
