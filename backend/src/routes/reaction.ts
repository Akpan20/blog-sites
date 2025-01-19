import { Router, Request, Response } from 'express';
import Reaction from '../models/Reaction';
import Post from '../models/Post';

export const ReactionType = {
  LIKE: 'like',
  LOVE: 'love',
  LAUGH: 'laugh',
  SAD: 'sad',
  ANGRY: 'angry',
} as const;

type ReactionTypeValue = typeof ReactionType[keyof typeof ReactionType];

interface CreateReactionBody {
  postId: number;
  userId: number;
  type: ReactionTypeValue;
}

interface DeleteReactionBody {
  postId: number;
  userId: number;
}

interface PaginationQuery {
  limit?: string;
  offset?: string;
}

const router = Router();

// Create a reaction
router.post<{}, {}, CreateReactionBody>('/', async (req, res) => {
  const { postId, userId, type } = req.body;

  try {
    if (!Object.values(ReactionType).includes(type)) {
      res.status(400).json({ error: 'Invalid reaction type' });
      return; // Exit early without returning a value
    }

    const reaction = await Reaction.create({
      postId,
      userId,
      type,
    });

    res.status(201).json(reaction); // Send response without returning
  } catch (error: any) {
    res.status(400).json({ error: error.message }); // Send error response without returning
  }
});

// Delete a reaction
router.delete<{}, {}, DeleteReactionBody>('/', async (req, res) => {
  const { postId, userId } = req.body;

  try {
    const deleted = await Reaction.destroy({
      where: { postId, userId },
    });

    if (!deleted) {
      res.status(404).json({ message: 'Reaction not found' });
      return; // Exit early without returning a value
    }

    res.status(200).json({ message: 'Reaction deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get reactions for a post
router.get<{ postId: string }, {}, {}, {}>('/post/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const reactions = await Reaction.findAll({
      where: { postId: Number(postId) },
    });

    res.status(200).json(reactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get reactions by a user
router.get<{ userId: string }, {}, {}, PaginationQuery>('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { limit = '10', offset = '0' } = req.query;

  try {
    const reactions = await Reaction.findAll({
      where: { userId: Number(userId) },
      include: [
        {
          model: Post,
          attributes: ['title'],
        },
      ],
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(reactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;