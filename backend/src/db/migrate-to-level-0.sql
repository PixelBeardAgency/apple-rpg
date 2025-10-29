-- Migration Script: Update to Level 0 System
-- Run this in Supabase SQL Editor to migrate existing data

-- Step 1: Update users table default for new users
ALTER TABLE public.users 
  ALTER COLUMN current_level SET DEFAULT 0;

-- Step 2: Add Level 0 to levels table
INSERT INTO public.levels (level_number, xp_required)
VALUES (0, 0)
ON CONFLICT (level_number) DO NOTHING;

-- Step 3: OPTIONAL - Reset existing users to Level 0
-- ONLY RUN THIS IF YOU WANT TO RESET ALL USER PROGRESS!
-- Uncomment the lines below to reset:

-- UPDATE public.users
-- SET current_level = 0, total_xp = 0
-- WHERE current_level = 1 AND total_xp = 0;

-- Note: This only resets users at Level 1 with 0 XP.
-- Users who have earned XP will keep their progress.
-- They will need to manually recalculate their level using:

-- UPDATE public.users AS u
-- SET current_level = (
--     SELECT COALESCE(MAX(l.level_number), 0)
--     FROM public.levels AS l
--     WHERE u.total_xp >= l.xp_required
-- );

