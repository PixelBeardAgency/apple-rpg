// Achievements endpoint - Vercel Serverless Function
import { createClient } from '@supabase/supabase-js';

// Auth helper
async function authenticate(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'No token provided', status: 401 };
  }

  const token = authHeader.substring(7);
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return { error: 'Invalid token', status: 401 };
  }

  return { userId: user.id, supabase };
}

// Get achievement progress
async function getAchievementProgress(userId, criteriaType, criteriaValue, supabase) {
  let currentValue = 0;

  switch (criteriaType) {
    case 'TASKS_CREATED':
      const { count: tasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      currentValue = tasksCount || 0;
      break;

    case 'HIGH_PRIORITY_COMPLETED':
      const { count: highCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('priority', 'HIGH')
        .eq('is_completed', true);
      currentValue = highCount || 0;
      break;

    case 'MEDIUM_PRIORITY_COMPLETED':
      const { count: medCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('priority', 'MEDIUM')
        .eq('is_completed', true);
      currentValue = medCount || 0;
      break;

    case 'LOW_PRIORITY_COMPLETED':
      const { count: lowCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('priority', 'LOW')
        .eq('is_completed', true);
      currentValue = lowCount || 0;
      break;

    case 'LEVEL_REACHED':
      const { data: userData } = await supabase
        .from('users')
        .select('current_level')
        .eq('id', userId)
        .single();
      currentValue = userData?.current_level || 0;
      break;

    case 'LABELS_CREATED':
      const { count: labelsCount } = await supabase
        .from('labels')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_default', false);
      currentValue = labelsCount || 0;
      break;

    default:
      currentValue = 0;
  }

  return {
    current: Math.min(currentValue, criteriaValue),
    required: criteriaValue,
    percentage: Math.min(100, Math.floor((currentValue / criteriaValue) * 100))
  };
}

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authenticate
  const authResult = await authenticate(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const { userId, supabase } = authResult;

  try {
    // Get all achievements
    const { data: allAchievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .order('criteria_value', { ascending: true });

    if (achievementsError) throw achievementsError;

    // Get user's earned achievements
    const { data: earnedAchievements, error: earnedError } = await supabase
      .from('user_achievements')
      .select('achievement_id, earned_at')
      .eq('user_id', userId);

    if (earnedError) throw earnedError;

    // Create a map of earned achievements
    const earnedMap = new Map(
      earnedAchievements.map(a => [a.achievement_id, a.earned_at])
    );

    // Merge data with progress
    const achievementsWithStatus = await Promise.all(
      allAchievements.map(async (achievement) => {
        const isEarned = earnedMap.has(achievement.id);
        const progress = isEarned 
          ? { current: achievement.criteria_value, required: achievement.criteria_value, percentage: 100 }
          : await getAchievementProgress(userId, achievement.criteria_type, achievement.criteria_value, supabase);

        return {
          ...achievement,
          earned: isEarned,
          earned_at: earnedMap.get(achievement.id) || null,
          progress
        };
      })
    );

    res.json(achievementsWithStatus);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
}

