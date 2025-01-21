import express, { Request, Response } from 'express';
import UserActivity from '../models/UserActivity';

const router = express.Router();

// GET all user activities
router.get('/', async (req: Request, res: Response) => {
  try {
    const activities = await UserActivity.findAll();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user activities' });
  }
});

// GET user activities by user ID
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const activities = await UserActivity.findAll({
      where: { user_id: userId },
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user activities' });
  }
});

// GET user activities by post ID
router.get('/post/:postId', async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const activities = await UserActivity.findAll({
      where: { post_id: postId },
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user activities' });
  }
});

// POST create a new user activity
router.post('/', async (req: Request, res: Response) => {
  try {
    const { user_id, post_id, action } = req.body;

    // Validate the action type
    if (!['VIEW', 'LIKE', 'COMMENT'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action type' });
    }

    const activity = await UserActivity.create({
      user_id,
      post_id,
      action,
    });
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user activity' });
  }
});

// DELETE a user activity by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid activity ID' });
    }

    const activity = await UserActivity.findByPk(id);
    if (activity) {
      await activity.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

export default router;