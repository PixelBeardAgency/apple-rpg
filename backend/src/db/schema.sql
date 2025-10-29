-- RPG Todo Database Schema
-- Supabase PostgreSQL Database
-- Phase 2: Core Features

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. USERS TABLE (extends auth.users)
-- ========================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  profile_picture_url TEXT,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 0,
  tutorial_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);


-- ========================================
-- 2. LEVELS TABLE (20 levels with exponential XP)
-- ========================================
CREATE TABLE IF NOT EXISTS public.levels (
  level_number INTEGER PRIMARY KEY,
  xp_required INTEGER NOT NULL
);

-- Enable Row Level Security (read-only for all authenticated users)
ALTER TABLE public.levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view levels" ON public.levels
  FOR SELECT TO authenticated USING (true);


-- ========================================
-- 3. TASKS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')) NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  xp_earned INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
CREATE POLICY "Users can view own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_completed_idx ON public.tasks(is_completed);


-- ========================================
-- 4. LABELS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Enable Row Level Security
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;

-- RLS Policies for labels
CREATE POLICY "Users can view own labels and defaults" ON public.labels
  FOR SELECT USING (auth.uid() = user_id OR is_default = true);

CREATE POLICY "Users can insert own labels" ON public.labels
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own labels" ON public.labels
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own labels" ON public.labels
  FOR DELETE USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS labels_user_id_idx ON public.labels(user_id);


-- ========================================
-- 5. TASK_LABELS JUNCTION TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.task_labels (
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES public.labels(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, label_id)
);

-- Enable Row Level Security
ALTER TABLE public.task_labels ENABLE ROW LEVEL SECURITY;

-- RLS Policies for task_labels
CREATE POLICY "Users can manage task labels" ON public.task_labels
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.tasks
      WHERE tasks.id = task_labels.task_id
      AND tasks.user_id = auth.uid()
    )
  );


-- ========================================
-- 6. ACHIEVEMENTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  criteria_type TEXT NOT NULL,
  criteria_value INTEGER NOT NULL,
  bonus_xp INTEGER NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (read-only for all authenticated users)
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements" ON public.achievements
  FOR SELECT TO authenticated USING (true);


-- ========================================
-- 7. USER_ACHIEVEMENTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS user_achievements_user_id_idx ON public.user_achievements(user_id);


-- ========================================
-- FUNCTIONS & TRIGGERS
-- ========================================

-- Function to automatically create user profile after auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, total_xp, current_level)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    0,
    1
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ========================================
-- COMMENTS FOR DOCUMENTATION
-- ========================================
COMMENT ON TABLE public.users IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.levels IS '20 levels with exponential XP requirements';
COMMENT ON TABLE public.tasks IS 'User tasks with priority and completion tracking';
COMMENT ON TABLE public.labels IS 'Custom labels for task organization';
COMMENT ON TABLE public.task_labels IS 'Many-to-many relationship between tasks and labels';
COMMENT ON TABLE public.achievements IS '10 achievements with bonus XP rewards';
COMMENT ON TABLE public.user_achievements IS 'Tracks which achievements users have earned';

-- Schema creation complete!

