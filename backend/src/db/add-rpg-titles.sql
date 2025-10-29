-- Add RPG title field to users table
-- This will store a persistent mythical title for each user

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS rpg_title TEXT;

-- Update existing users to have a random RPG title
-- (This will be handled by the backend registration for new users)

