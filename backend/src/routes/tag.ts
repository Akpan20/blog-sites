import express from 'express';
import Tag from '../models/Tag';

const router = express.Router();

// GET all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// GET a single tag by ID
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (tag) {
      res.json(tag);
    } else {
      res.status(404).json({ error: 'Tag not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tag' });
  }
});

// POST a new tag
router.post('/', async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tag' });
  }
});

// PUT/PATCH update a tag
router.put('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (tag) {
      await tag.update(req.body);
      res.json(tag);
    } else {
      res.status(404).json({ error: 'Tag not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tag' });
  }
});

// DELETE a tag
router.delete('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (tag) {
      await tag.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Tag not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tag' });
  }
});

export default router;