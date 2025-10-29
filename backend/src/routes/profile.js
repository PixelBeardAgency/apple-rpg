// Profile Routes
// Handles user profile operations

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { authenticate } from '../middleware/auth.js';
import { getUserProgress } from '../services/xpService.js';

dotenv.config();

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// All profile routes require authentication
router.use(authenticate);

/**
 * GET /api/profile
 * Get authenticated user's profile
 */
router.get('/', async (req, res) => {
  try {
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.userId)
      .single();

    if (profileError) throw profileError;

    // Get user progress (level, XP, progress bar data)
    const progress = await getUserProgress(req.userId);

    // Get achievements count
    const { count: achievementsCount } = await supabase
      .from('user_achievements')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.userId);

    // Get total achievements
    const { count: totalAchievements } = await supabase
      .from('achievements')
      .select('*', { count: 'exact', head: true });

    res.json({
      ...profile,
      progress,
      achievements: {
        earned: achievementsCount || 0,
        total: totalAchievements || 10
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * PATCH /api/profile
 * Update user profile
 */
router.patch('/', async (req, res) => {
  try {
    const { username, bio, profile_picture_url } = req.body;

    const updates = {};
    if (username !== undefined) updates.username = username;
    if (bio !== undefined) updates.bio = bio;
    if (profile_picture_url !== undefined) updates.profile_picture_url = profile_picture_url;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.userId)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;

