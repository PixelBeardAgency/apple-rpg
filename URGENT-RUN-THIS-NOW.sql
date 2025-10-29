-- ============================================================================
-- COMPLETE FIX: RPG Titles + Level 0 Issue
-- Run this ENTIRE script in Supabase SQL Editor (all at once)
-- ============================================================================

-- Step 1: Add Level 0 to levels table (CRITICAL!)
INSERT INTO public.levels (level_number, xp_required)
VALUES (0, 0)
ON CONFLICT (level_number) DO NOTHING;

-- Step 2: Add rpg_title column (if not exists)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS rpg_title TEXT;

-- Step 3: Update the trigger function to:
--   - Support rpg_title from user metadata
--   - Set current_level to 0 (not 1)
--   - Set total_xp to 0
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, rpg_title, total_xp, current_level)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.raw_user_meta_data->>'rpg_title',
    0,
    0  -- Start at Level 0 (0 XP)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Fix ALL existing users
-- Set everyone with less than 100 XP to Level 0
UPDATE public.users
SET current_level = 0
WHERE total_xp < 100;

-- Step 5: Verify the changes
-- This will show you the results
SELECT 
  username,
  rpg_title,
  total_xp,
  current_level,
  created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 10;

-- ============================================================================
-- WHAT THIS DOES:
-- 1. Adds Level 0 to the levels table (xp_required = 0) - CRITICAL FIX!
-- 2. Adds rpg_title column to users table
-- 3. Updates the registration trigger to:
--    - Accept rpg_title from signup metadata
--    - Start new users at Level 0 (not Level 1)
-- 4. Fixes all existing users with <100 XP to be Level 0
-- 5. Shows you the last 10 users to verify it worked
-- ============================================================================

