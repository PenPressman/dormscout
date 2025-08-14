-- Fix critical security vulnerability: Restrict profile access to own profile only
DROP POLICY IF EXISTS "Users can view profiles from their school" ON public.profiles;

-- New secure policy: Users can only view their own profile
CREATE POLICY "Users can view their own profile only" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());

-- Create a separate view for public profile information (without emails)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  user_id,
  school_id,
  role,
  verified_at,
  created_at,
  updated_at
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.public_profiles SET (security_invoker = true);

-- Create policy for the public view (school-based access but NO email)
CREATE POLICY "Users can view public profiles from their school" ON public.public_profiles
  FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));

-- Update photos and posts policies to use public profiles for joins
-- These policies are already secure as they check school membership through room->building->school chain