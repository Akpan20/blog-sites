import express, { Request, Response } from 'express';
import User from '../models/User';
import { validateUser } from '../middleware/validation';

const router = express.Router();

/**
 * Create a new user
 */
router.post('/', validateUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    // Create the user
    const user = await User.createUser({ username, email, password });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
