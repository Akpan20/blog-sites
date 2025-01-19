import express, { Request, Response } from 'express';
import auth from '../middleware/auth';
import upload from '../middleware/upload';
import { uploadToS3 } from '../services/fileUploadService';
import User from '../models/User';
import { getUserStats } from '../services/statsService';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(400).json({ error: 'User not authenticated' });
      return;
    }

    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const stats = await getUserStats(userId.toString());
    res.json({ user, stats });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'bio', 'email'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    res.status(400).json({ error: 'Invalid updates' });
    return;
  }

  try {
    if (!req.user) {
      res.status(400).json({ error: 'User not authenticated' });
      return;
    }

    // Find the user by ID using Sequelize
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    updates.forEach(update => {
      if (allowedUpdates.includes(update)) {
        (user as any)[update] = req.body[update];
      }
    });

    if (req.file) {
      user.avatar = await uploadToS3(req.file);
    }

    // Save the updated user
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

const router = express.Router();
router.get('/profile', auth, getProfile);
router.put('/profile', auth, upload.single('avatar'), updateProfile);

export default router;
