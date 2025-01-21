import express, { Request, Response, NextFunction } from 'express';
import pool from '../db/pool';
import cacheMiddleware from '../middleware/cache';
import { validatePost } from '../middleware/validation';
import { User } from '../types/User';

// Extend the Request type to include the `user` property
declare namespace Express {
  interface Request {
    user?: User;
  }
}

/**
 * Get all posts with pagination
 */
export const getPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const query = {
      text: `
        SELECT 
          p.*,
          u.username as author,
          COUNT(DISTINCT c.id) as comments_count,
          COUNT(DISTINCT r.id) as likes_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN comments c ON c.post_id = p.id
        LEFT JOIN reactions r ON r.post_id = p.id AND r.type = 'LIKE'
        GROUP BY p.id, u.username
        ORDER BY p.created_at DESC
        LIMIT $1 OFFSET $2
      `,
      values: [limit, offset],
    };

    const { rows } = await pool.query(query);
    res.json(rows); // Send the response
  } catch (error) {
    next(error); // Pass errors to Express error handler
  }
};

/**
 * Create a new post
 */
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, content } = req.body;

    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const query = {
      text: `
        INSERT INTO posts (title, content, user_id, created_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
        RETURNING *
      `,
      values: [title, content, req.user.id],
    };

    const { rows } = await pool.query(query);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error); // Pass errors to Express error handler
  }
};

/**
 * Delete a post by ID
 */
export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { postId } = req.params;

    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Check if the post exists and belongs to the authenticated user
    const findQuery = {
      text: `SELECT * FROM posts WHERE id = $1 AND user_id = $2`,
      values: [postId, req.user.id],
    };

    const { rowCount } = await pool.query(findQuery);

    if (rowCount === 0) {
      res.status(404).json({ error: 'Post not found or not authorized to delete' });
      return;
    }

    const deleteQuery = {
      text: `DELETE FROM posts WHERE id = $1`,
      values: [postId],
    };

    await pool.query(deleteQuery);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error); // Pass errors to Express error handler
  }
};

const router = express.Router();

router.get('/', cacheMiddleware(300), getPosts);
router.post('/', validatePost, createPost);
router.delete('/:postId', deletePost);

export default router;
