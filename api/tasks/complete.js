// Complete task endpoint - Vercel Serverless Function
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
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'No token provided', status: 401 };
  }

  const token = authHeader.substring(7);
  
  const userClient = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    }
  );

  const { data: { user }, error } = await userClient.auth.getUser();
  
  if (error || !user) {
    return { error: 'Invalid token', status: 401 };
  }
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  return { userId: user.id, supabase };
}

// Level up checker
async function checkLevelUp(userId, totalXP, supabase) {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('current_level')
      .eq('id', userId)
      .single();

    const currentLevel = user.current_level;

    const { data: levels } = await supabase
      .from('levels')
      .select('*')
      .gt('level_number', currentLevel)
      .order('level_number', { ascending: true });

    let newLevel = currentLevel;
    for (const level of levels || []) {
      if (totalXP >= level.xp_required) {
        newLevel = level.level_number;
      } else {
        break;
      }
    }

    if (newLevel > currentLevel) {
      await supabase
        .from('users')
        .update({ current_level: newLevel })
        .eq('id', userId);

      return {
        leveledUp: true,
        oldLevel: currentLevel,
        newLevel: newLevel
      };
    }

    return { leveledUp: false };
  } catch (error) {
    console.error('Error checking level up:', error);
    return { leveledUp: false };
  }
}

// Achievement checker
async function checkAndAwardAchievements(userId, supabase, priority) {
  try {
    const newAchievements = [];

    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('*');

    const { data: earnedAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    const earnedIds = new Set(earnedAchievements?.map(a => a.achievement_id) || []);
    const unearnedAchievements = allAchievements?.filter(a => !earnedIds.has(a.id)) || [];

    for (const achievement of unearnedAchievements) {
      let qualifies = false;

      if (achievement.criteria_type === 'HIGH_PRIORITY_COMPLETED' && priority === 'HIGH') {
        const { count } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('priority', 'HIGH')
          .eq('is_completed', true);
        qualifies = count >= achievement.criteria_value;
      } else if (achievement.criteria_type === 'MEDIUM_PRIORITY_COMPLETED' && priority === 'MEDIUM') {
        const { count } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('priority', 'MEDIUM')
          .eq('is_completed', true);
        qualifies = count >= achievement.criteria_value;
      } else if (achievement.criteria_type === 'LOW_PRIORITY_COMPLETED' && priority === 'LOW') {
        const { count } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('priority', 'LOW')
          .eq('is_completed', true);
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
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authenticate
  const authResult = await authenticate(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const { userId, supabase } = authResult;

  try {
    // Get task ID from body
    const { taskId } = req.body;
    
    if (!taskId) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    // Get task details
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', userId)
      .single();

    if (taskError) throw taskError;

    if (task.is_completed) {
      return res.status(400).json({ error: 'Task already completed' });
    }

    // Calculate XP
    const xpEarned = XP_VALUES[task.priority] || 0;

    // Mark task as complete
    await supabase
      .from('tasks')
      .update({
        is_completed: true,
        completed_at: new Date().toISOString(),
        xp_earned: xpEarned
      })
      .eq('id', taskId);

    // Get current user XP
    const { data: user } = await supabase
      .from('users')
      .select('total_xp, current_level')
      .eq('id', userId)
      .single();

    const newTotalXP = user.total_xp + xpEarned;

    // Update user's total XP
    await supabase
      .from('users')
      .update({ total_xp: newTotalXP })
      .eq('id', userId);

    // Check for level up
    const levelUpResult = await checkLevelUp(userId, newTotalXP, supabase);

    // Check for achievements
    const newAchievements = await checkAndAwardAchievements(userId, supabase, task.priority);

    res.json({
      message: 'Task completed',
      xpEarned: xpEarned,
      totalXP: newTotalXP,
      levelUp: levelUpResult.leveledUp ? {
        oldLevel: levelUpResult.oldLevel,
        newLevel: levelUpResult.newLevel
      } : null,
      achievements: newAchievements
    });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
}

