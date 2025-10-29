// Profile endpoint - Vercel Serverless Function
// Handles GET (profile) and PATCH (update profile)
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

// Get user progress
async function getUserProgress(userId, supabase) {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('total_xp, current_level')
      .eq('id', userId)
      .single();

    // Get current level requirements
    const { data: currentLevel } = await supabase
      .from('levels')
      .select('xp_required')
      .eq('level_number', user.current_level)
      .single();

    // Get next level requirements
    const { data: nextLevel } = await supabase
      .from('levels')
      .select('xp_required')
      .eq('level_number', user.current_level + 1)
      .maybeSingle();

    const isMaxLevel = !nextLevel;
    const xpForCurrentLevel = currentLevel.xp_required;
    const xpForNextLevel = nextLevel ? nextLevel.xp_required : user.total_xp;
    const xpProgress = user.total_xp - xpForCurrentLevel;
    const xpNeeded = xpForNextLevel - xpForCurrentLevel;
    const progressPercentage = isMaxLevel ? 100 : Math.floor((xpProgress / xpNeeded) * 100);

    return {
      currentLevel: user.current_level,
      totalXP: user.total_xp,
      xpForNextLevel: isMaxLevel ? null : xpForNextLevel,
      xpProgress: isMaxLevel ? 0 : xpProgress,
      xpNeeded: isMaxLevel ? 0 : xpNeeded,
      progressPercentage,
      isMaxLevel
    };
  } catch (error) {
    console.error('Error getting user progress:', error);
    return null;
  }
}

export default async function handler(req, res) {
  // Authenticate
  const authResult = await authenticate(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const { userId, supabase } = authResult;

  // GET - Fetch profile
  if (req.method === 'GET') {
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Get user progress
      const progress = await getUserProgress(userId, supabase);

      // Get achievements count
      const { count: achievementsCount } = await supabase
        .from('user_achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

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
  }
  // PATCH - Update profile
  else if (req.method === 'PATCH') {
    try {
      const { username, bio, profile_picture_url } = req.body;

      const updates = {};
      if (username !== undefined) updates.username = username;
      if (bio !== undefined) updates.bio = bio;
      if (profile_picture_url !== undefined) updates.profile_picture_url = profile_picture_url;

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      res.json(data);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

