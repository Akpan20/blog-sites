import express, { Request, Response } from 'express';
import auth from '../middleware/auth';
import Tag from '../models/Tags';

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const tag = await Tag.create({ name });
    res.status(201).json(tag);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(400).json({ error: errorMessage });
  }
};

// Attach to router
const router = express.Router();
router.post('/tags', auth, createTag);
export default router;