// Level Routes
// Handles fetching level data

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { authenticate } from '../middleware/auth.js';

dotenv.config();

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// All level routes require authentication
router.use(authenticate);

/**
 * GET /api/levels
 * Get all 20 levels with XP requirements
 */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .order('level_number', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching levels:', error);
    res.status(500).json({ error: 'Failed to fetch levels' });
  }
});

export default router;

