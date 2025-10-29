// Task Routes
// Handles CRUD operations for tasks

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { authenticate } from '../middleware/auth.js';
import { calculateTaskXP, awardXP } from '../services/xpService.js';
import { checkAndAwardAchievements } from '../services/achievementService.js';

dotenv.config();

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// All task routes require authentication
router.use(authenticate);

/**
 * GET /api/tasks
 * Get all tasks for authenticated user (with optional label filters)
 */
router.get('/', async (req, res) => {
  try {
    const { labels } = req.query; // Optional: comma-separated label IDs

    let query = supabase
      .from('tasks')
      .select(`
        *,
        task_labels (
          label:labels (*)
        )
      `)
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    // Transform data to flatten labels
    const tasksWithLabels = data.map(task => ({
      ...task,
      labels: task.task_labels?.map(tl => tl.label) || []
    }));

    // Filter by labels if provided
    let filteredTasks = tasksWithLabels;
    if (labels) {
      const labelIds = labels.split(',');
      filteredTasks = tasksWithLabels.filter(task =>
        task.labels.some(label => labelIds.includes(label.id))
      );
    }

    res.json(filteredTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

/**
 * POST /api/tasks
 * Create a new task
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, due_date, label_ids } = req.body;

    if (!title || !priority) {
      return res.status(400).json({ error: 'Title and priority are required' });
    }

    if (!['HIGH', 'MEDIUM', 'LOW'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority level' });
    }

    // Create task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .insert({
        user_id: req.userId,
        title,
        description,
        priority,
        due_date
      })
      .select()
      .single();

    if (taskError) throw taskError;

    // Add label associations if provided
    if (label_ids && label_ids.length > 0) {
      const taskLabels = label_ids.map(label_id => ({
        task_id: task.id,
        label_id
      }));

      const { error: labelError } = await supabase
        .from('task_labels')
        .insert(taskLabels);

      if (labelError) throw labelError;
    }

    // Check for task creation achievements
    const newAchievements = await checkAndAwardAchievements(req.userId, 'TASK_CREATED');

    res.status(201).json({
      task,
      achievements: newAchievements
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

/**
 * PATCH /api/tasks/:id
 * Update a task
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, due_date, label_ids } = req.body;

    // Update task
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .update({
        title,
        description,
        priority,
        due_date
      })
      .eq('id', id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (taskError) throw taskError;

    // Update labels if provided
    if (label_ids !== undefined) {
      // Delete existing labels
      await supabase
        .from('task_labels')
        .delete()
        .eq('task_id', id);

      // Add new labels
      if (label_ids.length > 0) {
        const taskLabels = label_ids.map(label_id => ({
          task_id: id,
          label_id
        }));

        await supabase
          .from('task_labels')
          .insert(taskLabels);
      }
    }

    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

/**
 * PATCH /api/tasks/:id/complete
 * Mark task as complete and award XP
 */
router.patch('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;

    // Get task details
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.userId)
      .single();

    if (taskError) throw taskError;

    if (task.is_completed) {
      return res.status(400).json({ error: 'Task already completed' });
    }

    // Calculate XP
    const xpEarned = calculateTaskXP(task.priority);

    // Mark task as complete
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
        xp_earned: xpEarned
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // Award XP to user
    const xpResult = await awardXP(req.userId, xpEarned);

    // Check for achievements
    const newAchievements = await checkAndAwardAchievements(req.userId, 'TASK_COMPLETED', {
      priority: task.priority
    });

    res.json({
      message: 'Task completed',
      xpEarned: xpResult.xpAwarded,
      totalXP: xpResult.newTotalXP,
      levelUp: xpResult.leveledUp ? {
        oldLevel: xpResult.oldLevel,
        newLevel: xpResult.newLevel
      } : null,
      achievements: newAchievements
    });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId);

    if (error) throw error;

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;

