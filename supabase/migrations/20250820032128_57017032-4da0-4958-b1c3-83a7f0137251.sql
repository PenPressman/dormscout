-- Backfill missing profiles and promote admin
-- 1) Insert profiles for any auth.users missing in public.profiles, deriving school_id from email domain
INSERT INTO public.profiles (user_id, email, school_id)
SELECT 
  u.id,
  u.email,
  s.id AS school_id
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
LEFT JOIN public.schools s ON split_part(u.email, '@', 2) = ANY (s.domain_whitelist)
WHERE p.user_id IS NULL;

-- 2) Promote specific emails to admin role
UPDATE public.profiles
SET role = 'admin'
WHERE email IN (
  'penelopepressman@college.harvard.edu',
  'penelope.pressman@gmail.com'
);
