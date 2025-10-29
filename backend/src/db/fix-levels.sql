-- Quick Fix: Recalculate User Level Based on Total XP
-- Run this in Supabase SQL Editor to fix the levelling bug

-- This will update all users' levels based on their current total_xp
-- Useful after the bug where task completions bypassed the backend

UPDATE users 
SET current_level = (
  SELECT COALESCE(MAX(l.level_number), 1)
  FROM levels l
  WHERE l.xp_required <= users.total_xp
)
WHERE id IS NOT NULL;

-- To see the results for your user:
-- SELECT id, username, total_xp, current_level FROM users;

-- Expected results:
-- 100 XP = Level 1
-- 183 XP = Level 2  
-- 282 XP = Level 3
-- 375 XP = Level 3
-- 400 XP = Level 3
-- 547 XP = Level 4

