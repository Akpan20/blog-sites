import express, { Request, Response } from 'express';
import searchService from '../services/searchService';

const router = express.Router();

router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q, category, tag, startDate, endDate, page = '1', limit = '10' } = req.query;

    const results = await searchService.searchPosts(q as string, {
      category: category as string,
      tag: tag as string,
      startDate: startDate as string,
      endDate: endDate as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
