import express from 'express';
import { authMiddleware, optionalAuth } from '../middleware/auth';

const router = express.Router();

// Mock community data
const submissions = [
  {
    id: '1',
    title: 'Modern Button Collection',
    description: 'Beautiful animated buttons',
    rating: { up: 15, down: 2 }
  }
];

// Get community submissions
router.get('/submissions', optionalAuth, async (req, res) => {
  try {
    res.json({ submissions, message: 'Community endpoint working' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as communityRoutes };