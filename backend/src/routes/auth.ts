import express, { Request, Response } from 'express';
import { signToken } from '../utils/jwt';
import bcrypt from 'bcrypt';
import { validateRegistration, validateLogin } from '../middleware/validation';
import User from '../models/User';
import auth from '../middleware/auth';

const router = express.Router();

// Register a new user
router.post('/register', validateRegistration, async (req: Request, res: Response, next: Function) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Add a default avatar if not provided
    const avatar = req.body.avatar || 'default-avatar.png';  // You can specify any default avatar image

    const user = await User.create({ username, email, password: hashedPassword, avatar });

    const token = signToken({ id: user.id.toString() }, '7d');
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
});

// Login a user
router.post('/login', validateLogin, async (req: Request, res: Response, next: Function) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const token = signToken({ id: user.id.toString() }, '7d');
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

// Protected route - Get user profile
router.get('/profile', auth, async (req: Request, res: Response, next: Function) => {
  try {
    const user = (req as any).user; // Access the authenticated user
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router;
