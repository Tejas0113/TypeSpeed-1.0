-- ====================================================================
-- TypeSpeed - Supabase Database Schema & Setup Script
-- ====================================================================
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project (or create a new free project)
-- 3. In the left sidebar, click on "SQL Editor"
-- 4. Click "New query", paste the contents of this file, and click "Run"
-- ====================================================================

-- Enable UUID extension (enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PROFILES TABLE
-- Stores public user information linked directly to Supabase Auth
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies:
-- Anyone can view profiles (needed for leaderboards and public stats)
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Authenticated users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Authenticated users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- --------------------------------------------------------------------
-- 2. TEST RESULTS TABLE
-- Stores each completed typing test run
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  wpm INTEGER NOT NULL CHECK (wpm >= 0 AND wpm <= 400),
  raw_wpm INTEGER NOT NULL CHECK (raw_wpm >= 0),
  accuracy NUMERIC(5, 2) NOT NULL CHECK (accuracy >= 0 AND accuracy <= 100),
  duration INTEGER NOT NULL CHECK (duration IN (15, 30, 60)),
  correct_chars INTEGER DEFAULT 0 NOT NULL,
  incorrect_chars INTEGER DEFAULT 0 NOT NULL,
  errors INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Indexes for lightning fast queries and leaderboard sorting
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON public.test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_wpm ON public.test_results(wpm DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_duration_wpm ON public.test_results(duration, wpm DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON public.test_results(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- Test Results RLS Policies:
-- Anyone can view test results (needed for global leaderboard)
CREATE POLICY "Test results are viewable by everyone"
  ON public.test_results
  FOR SELECT
  USING (true);

-- Authenticated users can only record tests for their own user_id
CREATE POLICY "Authenticated users can insert their own test results"
  ON public.test_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Authenticated users can delete their own test results if desired
CREATE POLICY "Users can delete their own test results"
  ON public.test_results
  FOR DELETE
  USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 3. AUTOMATIC PROFILE CREATION TRIGGER
-- Creates a profile row automatically whenever a user signs up via Auth
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  desired_username TEXT;
BEGIN
  -- Grab username from user_metadata or generate fallback from email
  desired_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTRING(NEW.id::text, 1, 4)
  );

  -- Ensure username is unique or append suffix
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = desired_username) THEN
    desired_username := desired_username || '_' || SUBSTRING(NEW.id::text, 1, 4);
  END IF;

  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    desired_username,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------------
-- 4. GLOBAL LEADERBOARD VIEW
-- Returns each user's top WPM and associated stats
-- --------------------------------------------------------------------
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT DISTINCT ON (tr.user_id, tr.duration)
  tr.id AS test_id,
  tr.user_id,
  p.username,
  p.avatar_url,
  tr.wpm,
  tr.raw_wpm,
  tr.accuracy,
  tr.duration,
  tr.created_at
FROM public.test_results tr
JOIN public.profiles p ON tr.user_id = p.id
ORDER BY tr.user_id, tr.duration, tr.wpm DESC, tr.accuracy DESC, tr.created_at ASC;
