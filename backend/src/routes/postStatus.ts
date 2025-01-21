import express, { Request, Response } from 'express';
import Post from '../models/Post';
import { PostStatus } from '../models/PostStatus';

const router = express.Router();

// PATCH update post status
router.patch('/:postId/status', async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;  // UUID should be kept as a string

    const { status } = req.body;

    // Validate the status
    if (!Object.values(PostStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid post status' });
    }

    const post = await Post.findByPk(postId);
    if (post) {
      await post.update({ status });
      res.json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post status' });
  }
});

// GET posts by status
router.get('/status/:status', async (req: Request, res: Response) => {
  try {
    const status = req.params.status as typeof PostStatus[keyof typeof PostStatus];

    // Validate the status
    if (!Object.values(PostStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid post status' });
    }

    const posts = await Post.findAll({
      where: { status },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts by status' });
  }
});

export default router;
