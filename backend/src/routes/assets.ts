import express from 'express';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Simple asset routes for now
router.get('/', authMiddleware, async (req, res) => {
  try {
    res.json({ assets: [], message: 'Assets endpoint working' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export { router as assetRoutes };