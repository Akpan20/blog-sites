import express from 'express';
import Category from '../models/Category';

const router = express.Router();

// Create a new category
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const category = await Category.createCategory(name, description);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get a category by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.getCategoryById(Number(id));
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Update a category
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updatedCategory = await Category.updateCategory(Number(id), name, description);
    if (updatedCategory) {
      res.status(200).json(updatedCategory);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete a category
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const isDeleted = await Category.deleteCategory(Number(id));
    if (isDeleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;