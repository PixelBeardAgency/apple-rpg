-- Migration: Add RPG Title support and fix Level 0
-- Run this in Supabase SQL Editor

-- Step 1: Add rpg_title column if it doesn't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS rpg_title TEXT;

-- Step 2: Update the trigger function to support rpg_title and set current_level to 0
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, rpg_title, total_xp, current_level)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.raw_user_meta_data->>'rpg_title',
    0,
    0  -- Start at Level 0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger should already exist, but if not, create it:
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Fix existing users to start at Level 0 (if they're at Level 1 with 0 XP)
UPDATE public.users
SET current_level = 0
WHERE total_xp < 100 AND current_level = 1;

