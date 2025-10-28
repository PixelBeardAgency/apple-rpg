// Achievement Service
// Checks and awards achievements based on user actions

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { awardXP } from './xpService.js';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Check if user has earned any new achievements and award them
 * Returns array of newly earned achievements
 */
export async function checkAndAwardAchievements(userId, actionType, actionData = {}) {
  try {
    const newAchievements = [];

    // Get all achievements
    const { data: allAchievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*');

    if (achievementsError) throw achievementsError;

    // Get user's already earned achievements
    const { data: earnedAchievements, error: earnedError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    if (earnedError) throw earnedError;

    const earnedIds = new Set(earnedAchievements.map(a => a.achievement_id));

    // Filter achievements not yet earned
    const unearnedAchievements = allAchievements.filter(a => !earnedIds.has(a.id));

    // Check each unearned achievement
    for (const achievement of unearnedAchievements) {
      let qualifies = false;

      switch (achievement.criteria_type) {
        case 'TASKS_CREATED':
          qualifies = await checkTasksCreated(userId, achievement.criteria_value);
          break;
        case 'HIGH_PRIORITY_COMPLETED':
          qualifies = await checkPriorityCompleted(userId, 'HIGH', achievement.criteria_value);
          break;
        case 'MEDIUM_PRIORITY_COMPLETED':
          qualifies = await checkPriorityCompleted(userId, 'MEDIUM', achievement.criteria_value);
          break;
        case 'LOW_PRIORITY_COMPLETED':
          qualifies = await checkPriorityCompleted(userId, 'LOW', achievement.criteria_value);
          break;
        case 'LEVEL_REACHED':
          qualifies = await checkLevelReached(userId, achievement.criteria_value);
          break;
        case 'LABELS_CREATED':
          qualifies = await checkLabelsCreated(userId, achievement.criteria_value);
          break;
        default:
          break;
      }

      if (qualifies) {
        // Award achievement
        const { error: insertError } = await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id
          });

        if (!insertError) {
          // Award bonus XP
          await awardXP(userId, 0, achievement.bonus_xp);
          newAchievements.push(achievement);
        }
      }
    }

    return newAchievements;
  } catch (error) {
    console.error('Error checking achievements:', error);
    throw error;
  }
}

// Helper functions to check achievement criteria

async function checkTasksCreated(userId, requiredCount) {
  const { count, error } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  return !error && count >= requiredCount;
}

async function checkPriorityCompleted(userId, priority, requiredCount) {
  const { count, error } = await supabase
    .from('tasks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('priority', priority)
    .eq('is_completed', true);

  return !error && count >= requiredCount;
}

async function checkLevelReached(userId, requiredLevel) {
  const { data, error } = await supabase
    .from('users')
    .select('current_level')
    .eq('id', userId)
    .single();

  return !error && data.current_level >= requiredLevel;
}

async function checkLabelsCreated(userId, requiredCount) {
  const { count, error } = await supabase
    .from('labels')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_default', false);

  return !error && count >= requiredCount;
}

/**
 * Get all achievements with user's earned status
 */
export async function getAchievementsWithStatus(userId) {
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

    // Merge data
    const achievementsWithStatus = allAchievements.map(achievement => ({
      ...achievement,
      earned: earnedMap.has(achievement.id),
      earned_at: earnedMap.get(achievement.id) || null
    }));

    return achievementsWithStatus;
  } catch (error) {
    console.error('Error getting achievements with status:', error);
    throw error;
  }
}

