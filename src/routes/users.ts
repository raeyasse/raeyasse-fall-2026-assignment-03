import { Router } from 'express';
import { getAllUsers, getUserById, createUser } from '../dal/users.js';
import authMiddleware from '../middleware/auth.js';

// TODO: Student implementation - Part 1: User Routes
// GET /users
// GET /users/:id

// POST /users
const router = Router();

// return all users
router.get('/', async (req, res) => {
  res.json(await getAllUsers());
});

// return one user or 404
router.get('/:id', async (req, res) => {
  const user = await getUserById(Number(req.params.id));
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(user);
});

// create a user
router.post('/', authMiddleware, async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'name and email are required' });
    return;
  }
  const user = await createUser({ name, email });
  res.status(201).json(user);
});

export default router;
