import express, { Request, Response } from 'express';
import UserTrust from '../models/UserTrust';

const router = express.Router();

// GET trust score for a user
router.get('/:userId/score', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const trustScore = await UserTrust.getScore(userId);
    res.json({ userId, trustScore });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trust score' });
  }
});

// POST update trust score for a user
router.post('/:userId/score', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const { trustScore } = req.body;
    if (typeof trustScore !== 'number' || trustScore < 0 || trustScore > 1) {
      return res.status(400).json({ error: 'Invalid trust score. Must be between 0 and 1.' });
    }

    const updatedTrustRecord = await UserTrust.updateScore(userId, trustScore);
    res.status(201).json(updatedTrustRecord);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trust score' });
  }
});

// GET all trust records for a user
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const trustRecords = await UserTrust.findAll({
      where: { userId },
      order: [['lastCalculated', 'DESC']],
    });

    res.json(trustRecords);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trust records' });
  }
});

// DELETE a trust record by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid trust record ID' });
    }

    const trustRecord = await UserTrust.findByPk(id);
    if (trustRecord) {
      await trustRecord.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Trust record not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trust record' });
  }
});

export default router;