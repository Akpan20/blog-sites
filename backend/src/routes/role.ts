import express, { Request, Response } from 'express';
import { Role, RoleTypes } from '../models/Role';

const router = express.Router();

// GET all roles
router.get('/', async (req: Request, res: Response) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// GET a single role by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (role) {
      res.json(role);
    } else {
      res.status(404).json({ error: 'Role not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch role' });
  }
});

// POST create a new role
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    // Validate the role name
    if (!Object.values(RoleTypes).includes(name)) {
      return res.status(400).json({ error: 'Invalid role name' });
    }

    const role = await Role.create({ name });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create role' });
  }
});

// PUT update a role by ID
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    // Validate the role name
    if (!Object.values(RoleTypes).includes(name)) {
      return res.status(400).json({ error: 'Invalid role name' });
    }

    const role = await Role.findByPk(req.params.id);
    if (role) {
      await role.update({ name });
      res.json(role);
    } else {
      res.status(404).json({ error: 'Role not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// DELETE a role by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (role) {
      await role.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Role not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete role' });
  }
});

export default router;