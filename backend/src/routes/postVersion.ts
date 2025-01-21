import express, { Request, Response } from 'express';
import PostVersion from '../models/PostVersion';

const router = express.Router();

// POST create a new post version
router.post('/', async (req: Request, res: Response) => {
  try {
    const { postId, content, userId } = req.body;

    // Validate required fields
    if (!postId || !content || !userId) {
      return res.status(400).json({ error: 'postId, content, and userId are required' });
    }

    const version = await PostVersion.createVersion({ postId, content, userId });
    res.status(201).json(version);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post version' });
  }
});

// GET version history for a post
router.get('/post/:postId', async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const versions = await PostVersion.getVersionHistory(postId);
    res.json(versions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch version history' });
  }
});

// GET a specific version by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid version ID' });
    }

    const version = await PostVersion.findByPk(id);
    if (version) {
      res.json(version);
    } else {
      res.status(404).json({ error: 'Version not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch version' });
  }
});

// DELETE a version by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid version ID' });
    }

    const version = await PostVersion.findByPk(id);
    if (version) {
      await version.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Version not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete version' });
  }
});

export default router;