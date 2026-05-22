-- ============================================================
-- Matrix EA — Supabase Schema
-- Run this in the Supabase SQL Editor (Settings → SQL Editor)
-- ============================================================

-- Users (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT,
  company TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  duration_hours INTEGER,
  format TEXT DEFAULT 'In-person + lab',
  language TEXT DEFAULT 'English / Arabic',
  cohort_size TEXT DEFAULT '8–14 trainees',
  certificate TEXT DEFAULT 'Matrix EA',
  modules JSONB DEFAULT '[]',
  outcomes JSONB DEFAULT '[]',
  prerequisites TEXT,
  category TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  featured_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'pending_payment', 'active', 'completed', 'cancelled')),
  payment_method TEXT,
  payment_reference TEXT,
  amount_paid DECIMAL(10,2),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- Case Studies
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tag TEXT,
  client TEXT,
  sector TEXT,
  year INTEGER,
  summary TEXT,
  description TEXT,
  systems_used TEXT[],
  image_url TEXT,
  image_urls TEXT[],
  video_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Run this if the table already exists:
-- ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS tag TEXT;
-- ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS image_urls TEXT[];
-- ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Contact Submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  subject TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monitoring Data (for live dashboard)
CREATE TABLE IF NOT EXISTS monitoring_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id TEXT NOT NULL,
  source_name TEXT NOT NULL,
  value DECIMAL,
  unit TEXT,
  status TEXT CHECK (status IN ('on', 'off', 'warn')),
  metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ──────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- Helper: check admin role without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Profiles
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins read all profiles"
  ON profiles FOR ALL USING (public.is_admin());

-- Enrollments
CREATE POLICY "Users see own enrollments"
  ON enrollments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own enrollments"
  ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins manage enrollments"
  ON enrollments FOR ALL USING (public.is_admin());

-- Courses (public read for published)
CREATE POLICY "Public read published courses"
  ON courses FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Admins manage courses"
  ON courses FOR ALL USING (public.is_admin());

-- Monitoring
CREATE POLICY "Auth users read monitoring"
  ON monitoring_data FOR SELECT USING (auth.role() = 'authenticated');

-- Contact submissions
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins read contact submissions"
  ON contact_submissions FOR SELECT USING (public.is_admin());

-- Case studies (public read for published)
CREATE POLICY "Public read published case studies"
  ON case_studies FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Admins manage case studies"
  ON case_studies FOR ALL USING (public.is_admin());

-- ── Auto-create profile on signup ──────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ── Seed monitoring data ────────────────────────────────────

INSERT INTO monitoring_data (source_id, source_name, value, unit, status) VALUES
  ('solar', 'Solar Generation', 18.4, 'kW', 'on'),
  ('battery', 'Battery Charge', 87, '%', 'on'),
  ('grid', 'Grid (EDL)', 1, NULL, 'on'),
  ('motor_1', 'Pump Motor 1', 1450, 'RPM', 'on'),
  ('motor_2', 'Pump Motor 2', 0, 'RPM', 'off'),
  ('motor_3', 'Compressor', 2200, 'RPM', 'on')
ON CONFLICT DO NOTHING;
