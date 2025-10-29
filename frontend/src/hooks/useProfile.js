// React Query hook for user profile
// Manages profile data fetching and mutations

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/**
 * Fetch user profile with progress data
 */
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Get current and next level
      const { data: currentLevel } = await supabase
        .from('levels')
        .select('xp_required')
        .eq('level_number', profile.current_level)
        .single();

      const { data: nextLevel } = await supabase
        .from('levels')
        .select('xp_required')
        .eq('level_number', profile.current_level + 1)
        .maybeSingle();

      // Get achievements count
      const { count: achievementsCount } = await supabase
        .from('user_achievements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const { count: totalAchievements } = await supabase
        .from('achievements')
        .select('*', { count: 'exact', head: true });

      // Calculate progress
      const isMaxLevel = !nextLevel;
      const xpForCurrentLevel = currentLevel?.xp_required || 0;
      const xpForNextLevel = nextLevel?.xp_required || profile.total_xp;
      const xpProgress = profile.total_xp - xpForCurrentLevel;
      const xpNeeded = xpForNextLevel - xpForCurrentLevel;
      
      // Ensure progressPercentage is always a valid number between 0-100
      let progressPercentage = 0;
      if (isMaxLevel) {
        progressPercentage = 100;
      } else if (xpNeeded > 0) {
        progressPercentage = Math.max(0, Math.min(100, Math.floor((xpProgress / xpNeeded) * 100)));
      }
      
      console.log('Progress calculation:', {
        currentLevel: profile.current_level,
        totalXP: profile.total_xp,
        xpForCurrentLevel,
        xpForNextLevel,
        xpProgress,
        xpNeeded,
        progressPercentage
      });

      return {
        ...profile,
        progress: {
          currentLevel: profile.current_level,
          totalXP: profile.total_xp,
          xpForNextLevel: isMaxLevel ? null : xpForNextLevel,
          xpProgress: isMaxLevel ? 0 : xpProgress,
          xpNeeded: isMaxLevel ? 0 : xpNeeded,
          progressPercentage,
          isMaxLevel
        },
        achievements: {
          earned: achievementsCount || 0,
          total: totalAchievements || 10
        }
      };
    }
  });
};

/**
 * Update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, bio, profile_picture_url, rpg_title }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const updates = {};
      if (username !== undefined) updates.username = username;
      if (bio !== undefined) updates.bio = bio;
      if (profile_picture_url !== undefined) updates.profile_picture_url = profile_picture_url;
      if (rpg_title !== undefined) updates.rpg_title = rpg_title;

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });
};

