// Tasks endpoint - Vercel Serverless Function
// Handles GET (all tasks) and POST (create task)
import { createClient } from '@supabase/supabase-js';

// XP values by priority
const XP_VALUES = {
  HIGH: 100,
  MEDIUM: 50,
  LOW: 25
};

// Auth helper
async function authenticate(req) {
  const authHeader = req.headers.authorization;
  
  console.log('Auth check - has header:', !!authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'No token provided', status: 401 };
  }

  const token = authHeader.substring(7);
  
  console.log('Auth check - token length:', token.length);
  console.log('Auth check - has SUPABASE_URL:', !!process.env.SUPABASE_URL);
  console.log('Auth check - has SERVICE_ROLE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error) {
    console.error('Auth error:', error);
    return { error: `Invalid token: ${error.message}`, status: 401 };
  }
  
  if (!user) {
    console.error('No user returned from token verification');
    return { error: 'Invalid token', status: 401 };
  }

  console.log('Auth success - user ID:', user.id);
  return { userId: user.id, supabase };
}

// Achievement checker
async function checkAndAwardAchievements(userId, supabase, actionType) {
  try {
    const newAchievements = [];

    // Get all achievements
    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('*');

    // Get user's earned achievements
    const { data: earnedAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    const earnedIds = new Set(earnedAchievements?.map(a => a.achievement_id) || []);
    const unearnedAchievements = allAchievements?.filter(a => !earnedIds.has(a.id)) || [];

    // Check each unearned achievement
    for (const achievement of unearnedAchievements) {
      let qualifies = false;

      if (achievement.criteria_type === 'TASKS_CREATED') {
        const { count } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);
        qualifies = count >= achievement.criteria_value;
      }

      if (qualifies) {
        const { error: insertError } = await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id
          });

        if (!insertError) {
          // Award bonus XP
          const { data: user } = await supabase
            .from('users')
            .select('total_xp')
            .eq('id', userId)
            .single();

          const newTotalXP = user.total_xp + achievement.bonus_xp;
          await supabase
            .from('users')
            .update({ total_xp: newTotalXP })
            .eq('id', userId);

          newAchievements.push(achievement);
        }
      }
    }

    return newAchievements;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
}

export default async function handler(req, res) {
  // Authenticate
  const authResult = await authenticate(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const { userId, supabase } = authResult;

  // GET - Fetch all tasks
  if (req.method === 'GET') {
    try {
      const { labels } = req.query;

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          task_labels (
            label:labels (*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

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
  }
  // POST - Create new task
  else if (req.method === 'POST') {
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
          user_id: userId,
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

        await supabase
          .from('task_labels')
          .insert(taskLabels);
      }

      // Check for achievements
      const newAchievements = await checkAndAwardAchievements(userId, supabase, 'TASK_CREATED');

      res.status(201).json({
        task,
        achievements: newAchievements
      });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

