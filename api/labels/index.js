// Labels endpoint - Vercel Serverless Function
// Handles GET (all labels) and POST (create label)
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

// Achievement checker for labels
async function checkAndAwardAchievements(userId, supabase) {
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

      if (achievement.criteria_type === 'LABELS_CREATED') {
        const { count } = await supabase
          .from('labels')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_default', false);
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
  // Authenticate
  const authResult = await authenticate(req);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const { userId, supabase } = authResult;

  // GET - Fetch all labels
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('labels')
        .select('*')
        .or(`user_id.eq.${userId},is_default.eq.true`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      res.json(data);
    } catch (error) {
      console.error('Error fetching labels:', error);
      res.status(500).json({ error: 'Failed to fetch labels' });
    }
  }
  // POST - Create new label
  else if (req.method === 'POST') {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Label name is required' });
      }

      // Create label
      const { data: label, error: labelError } = await supabase
        .from('labels')
        .insert({
          user_id: userId,
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

      // Check for achievements
      const newAchievements = await checkAndAwardAchievements(userId, supabase);

      res.status(201).json({
        label,
        achievements: newAchievements
      });
    } catch (error) {
      console.error('Error creating label:', error);
      res.status(500).json({ error: 'Failed to create label' });
    }
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

