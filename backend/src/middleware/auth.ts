import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User from '../models/User';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error('No token provided');
    }

    // Verify the token using the utility function
    const decoded = verifyToken(token) as { id: string };

    // Find the user by ID
    const user = await User.findById(parseInt(decoded.id));

    if (!user) {
      throw new Error('User not found');
    }

    // Attach the user and token to the request object
    (req as any).user = user;
    (req as any).token = token;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

export default auth;
