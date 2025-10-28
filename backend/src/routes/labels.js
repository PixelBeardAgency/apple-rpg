// Label Routes
// Handles custom label management

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { authenticate } from '../middleware/auth.js';
import { checkAndAwardAchievements } from '../services/achievementService.js';

dotenv.config();

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// All label routes require authentication
router.use(authenticate);

/**
 * GET /api/labels
 * Get all labels (user's custom labels + default labels)
 */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('labels')
      .select('*')
      .or(`user_id.eq.${req.userId},is_default.eq.true`)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching labels:', error);
    res.status(500).json({ error: 'Failed to fetch labels' });
  }
});

/**
 * POST /api/labels
 * Create a new custom label
 */
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Label name is required' });
    }

    // Create label
    const { data: label, error: labelError } = await supabase
      .from('labels')
      .insert({
        user_id: req.userId,
        name,
        is_default: false
      })
      .select()
      .single();

    if (labelError) {
      if (labelError.code === '23505') {
        return res.status(400).json({ error: 'Label name already exists' });
      }
      throw labelError;
    }

    // Check for label creation achievements
    const newAchievements = await checkAndAwardAchievements(req.userId, 'LABEL_CREATED');

    res.status(201).json({
      label,
      achievements: newAchievements
    });
  } catch (error) {
    console.error('Error creating label:', error);
    res.status(500).json({ error: 'Failed to create label' });
  }
});

/**
 * PATCH /api/labels/:id
 * Update a label
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Label name is required' });
    }

    const { data, error } = await supabase
      .from('labels')
      .update({ name })
      .eq('id', id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Label name already exists' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error updating label:', error);
    res.status(500).json({ error: 'Failed to update label' });
  }
});

/**
 * DELETE /api/labels/:id
 * Delete a label (removes from all tasks via CASCADE)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if label belongs to user
    const { data: label, error: checkError } = await supabase
      .from('labels')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.userId)
      .single();

    if (checkError || !label) {
      return res.status(404).json({ error: 'Label not found' });
    }

    // Delete label (CASCADE will remove from task_labels automatically)
    const { error: deleteError } = await supabase
      .from('labels')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId);

    if (deleteError) throw deleteError;

    res.json({ message: 'Label deleted successfully' });
  } catch (error) {
    console.error('Error deleting label:', error);
    res.status(500).json({ error: 'Failed to delete label' });
  }
});

export default router;

