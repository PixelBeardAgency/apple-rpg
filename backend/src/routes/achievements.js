// Achievement Routes
// Handles fetching achievements with user's earned status

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getAchievementsWithStatus } from '../services/achievementService.js';

const router = express.Router();

// All achievement routes require authentication
router.use(authenticate);

/**
 * GET /api/achievements
 * Get all achievements with user's earned status
 */
router.get('/', async (req, res) => {
  try {
    const achievements = await getAchievementsWithStatus(req.userId);
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

export default router;

