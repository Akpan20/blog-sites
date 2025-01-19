import express, { Request, Response } from 'express';
import auth from '../middleware/auth';
import { validateComment } from '../middleware/validation';
import CommentModel from '../models/Comment';
import { User } from '../types/User';

// Extend Request type
declare module 'express' {
  interface Request {
    user?: User;
  }
}

const router = express.Router();

// Create a comment
router.post('/posts/:postId/comments', auth, validateComment, async (req: Request, res: Response): Promise<void> => {
  try {
    const comment = await CommentModel.create({
      content: req.body.content,
      postId: parseInt(req.params.postId, 10),
      userId: req.user!.id,
      status: 'pending', // Add default status if required
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get comments for a post
router.get('/posts/:postId/comments', async (req: Request, res: Response): Promise<void> => {
  try {
    const comments = await CommentModel.getByPostId(parseInt(req.params.postId, 10));
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Get a single comment by ID
router.get('/comments/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const comment = await CommentModel.findByPk(parseInt(req.params.id, 10));
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Delete a comment
router.delete('/comments/:id', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const comment = await CommentModel.findByPk(parseInt(req.params.id, 10));
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }
    if (comment.userId !== req.user!.id) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }
    await CommentModel.delete(parseInt(req.params.id, 10));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;