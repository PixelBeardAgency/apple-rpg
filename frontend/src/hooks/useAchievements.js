// React Query hook for achievements
// Manages achievement data fetching

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Fetch all achievements with user's earned status
 */
export const useAchievements = () => {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

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
        .eq('user_id', user.id);

      if (earnedError) throw earnedError;

      // Create a map of earned achievements
      const earnedMap = new Map(
        earnedAchievements.map(a => [a.achievement_id, a.earned_at])
      );

      // Merge data
      const achievementsWithStatus = allAchievements.map(achievement => ({
        ...achievement,
        earned: earnedMap.has(achievement.id),
        earned_at: earnedMap.get(achievement.id) || null
      }));

      return achievementsWithStatus;
    }
  });
};

