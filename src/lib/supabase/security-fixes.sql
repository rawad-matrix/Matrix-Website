-- ============================================================
-- Matrix EA — Security Fixes
-- Run this ONCE in the Supabase SQL Editor (Settings → SQL Editor).
-- Safe to re-run: every statement is idempotent.
--
-- Fixes:
--   1. Privilege escalation — students could set their own role to 'admin'
--   2. Enrollment integrity — students could self-insert 'active' enrollments
--   3. Missing RLS on site_settings / announcements (public defacement risk)
--   4. Storage bucket write policies (browser uploads use the anon key)
-- ============================================================

-- ── 1. Prevent role self-escalation ─────────────────────────
-- The "Users update own profile" policy has no column lock, so a
-- signed-in user could UPDATE their own profiles.role to 'admin'.
-- A BEFORE UPDATE trigger freezes the role for non-admins.

CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin() THEN
    NEW.role := OLD.role;  -- silently keep the existing role
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_role_change ON public.profiles;
CREATE TRIGGER trg_prevent_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_change();

-- ── 2. Enrollment integrity ─────────────────────────────────
-- The old INSERT policy only checked ownership, letting a student
-- insert status='active'. Restrict self-service inserts to 'pending'.
-- Only admins (service role / is_admin) can promote to 'active'.

DROP POLICY IF EXISTS "Users create own enrollments" ON public.enrollments;
CREATE POLICY "Users create own enrollments"
  ON public.enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- ── 3. site_settings — public read, admin write ─────────────
-- Written from the browser with the anon key, so an admin-only
-- WRITE policy is mandatory or anyone could deface the homepage.

CREATE TABLE IF NOT EXISTS public.site_settings (
  key   TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site settings"  ON public.site_settings;
DROP POLICY IF EXISTS "Admins write site settings" ON public.site_settings;

CREATE POLICY "Public read site settings"
  ON public.site_settings FOR SELECT USING (TRUE);

CREATE POLICY "Admins write site settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── 4. announcements — admin only ───────────────────────────

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  image_url TEXT,
  recipients_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage announcements" ON public.announcements;
CREATE POLICY "Admins manage announcements"
  ON public.announcements FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── 5. Storage buckets — public read, admin write ───────────
-- Images are uploaded from the admin pages with the anon key, so
-- writes to these buckets must be gated on the admin role.
-- Public read keeps the images viewable on the live site.

DO $$
DECLARE b TEXT;
BEGIN
  FOREACH b IN ARRAY ARRAY['site-images','course-images','case-studies','announcement-images']
  LOOP
    -- Ensure the bucket exists and is public-readable
    INSERT INTO storage.buckets (id, name, public)
    VALUES (b, b, TRUE)
    ON CONFLICT (id) DO UPDATE SET public = TRUE;
  END LOOP;
END $$;

-- Public read for all four buckets
DROP POLICY IF EXISTS "Public read matrix buckets" ON storage.objects;
CREATE POLICY "Public read matrix buckets"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('site-images','course-images','case-studies','announcement-images'));

-- Admin-only insert / update / delete
DROP POLICY IF EXISTS "Admins write matrix buckets" ON storage.objects;
CREATE POLICY "Admins write matrix buckets"
  ON storage.objects FOR ALL
  USING (
    bucket_id IN ('site-images','course-images','case-studies','announcement-images')
    AND public.is_admin()
  )
  WITH CHECK (
    bucket_id IN ('site-images','course-images','case-studies','announcement-images')
    AND public.is_admin()
  );
