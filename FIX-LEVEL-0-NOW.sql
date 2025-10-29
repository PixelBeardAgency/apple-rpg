-- FINAL Migration: Complete Level 0 System
-- Run this in Supabase SQL Editor NOW

-- Step 1: Verify Level 0 exists
SELECT * FROM public.levels WHERE level_number = 0;
-- You should see: level_number=0, xp_required=0

-- Step 2: Update the default for new users
ALTER TABLE public.users 
  ALTER COLUMN current_level SET DEFAULT 0;

-- Step 3: Fix your newly created account (and any at Level 1 with 0 XP)
UPDATE public.users
SET current_level = 0
WHERE current_level = 1 AND total_xp = 0;

-- Step 4: Verify the change
SELECT id, username, current_level, total_xp 
FROM public.users 
WHERE current_level = 0;
-- You should see your account listed here

-- That's it! New users will now start at Level 0.

