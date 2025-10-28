// XP Service
// Handles XP calculation, level-up logic, and user progression

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Fixed XP values by priority (MUST NOT CHANGE)
export const XP_VALUES = {
  HIGH: 100,
  MEDIUM: 50,
  LOW: 25
};

/**
 * Calculate XP based on task priority
 */
export function calculateTaskXP(priority) {
  return XP_VALUES[priority] || 0;
}

/**
 * Check if user should level up based on total XP
 * Returns new level if level up occurred, null otherwise
 */
export async function checkLevelUp(userId, totalXP) {
  try {
    // Get user's current level
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('current_level')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const currentLevel = user.current_level;

    // Get all levels greater than current level
    const { data: levels, error: levelsError } = await supabase
      .from('levels')
      .select('*')
      .gt('level_number', currentLevel)
      .order('level_number', { ascending: true });

    if (levelsError) throw levelsError;

    // Find the highest level the user qualifies for
    let newLevel = currentLevel;
    for (const level of levels) {
      if (totalXP >= level.xp_required) {
        newLevel = level.level_number;
      } else {
        break;
      }
    }

    // If level changed, update user
    if (newLevel > currentLevel) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ current_level: newLevel })
        .eq('id', userId);

      if (updateError) throw updateError;

      return {
        leveledUp: true,
        oldLevel: currentLevel,
        newLevel: newLevel
      };
    }

    return { leveledUp: false };
  } catch (error) {
    console.error('Error checking level up:', error);
    throw error;
  }
}

/**
 * Award XP to user and check for level up
 */
export async function awardXP(userId, xpEarned, bonusXP = 0) {
  try {
    const totalXPToAdd = xpEarned + bonusXP;

    // Get current user XP
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('total_xp, current_level')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    const newTotalXP = user.total_xp + totalXPToAdd;

    // Update user's total XP
    const { error: updateError } = await supabase
      .from('users')
      .update({ total_xp: newTotalXP })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Check for level up
    const levelUpResult = await checkLevelUp(userId, newTotalXP);

    return {
      xpAwarded: totalXPToAdd,
      newTotalXP: newTotalXP,
      ...levelUpResult
    };
  } catch (error) {
    console.error('Error awarding XP:', error);
    throw error;
  }
}

/**
 * Get user's progress toward next level
 */
export async function getUserProgress(userId) {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('total_xp, current_level')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Get current level requirements
    const { data: currentLevel, error: currentLevelError } = await supabase
      .from('levels')
      .select('xp_required')
      .eq('level_number', user.current_level)
      .single();

    if (currentLevelError) throw currentLevelError;

    // Get next level requirements (if not max level)
    const { data: nextLevel, error: nextLevelError } = await supabase
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
    throw error;
  }
}

