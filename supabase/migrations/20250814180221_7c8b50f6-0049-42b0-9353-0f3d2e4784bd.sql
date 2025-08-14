-- Fix critical security vulnerability: Restrict profile access to own profile only
DROP POLICY IF EXISTS "Users can view profiles from their school" ON public.profiles;

-- New secure policy: Users can only view their own profile
CREATE POLICY "Users can view their own profile only" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());

-- Create a function to get public profile info (without sensitive data like email)
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  school_id UUID,
  role app_role,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.user_id,
    p.school_id,
    p.role,
    p.verified_at,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.user_id = profile_user_id
    AND p.school_id = public.get_user_school_id(auth.uid());
$$;

-- Create a function to check if current user can view posts/photos from the same school
-- This replaces the need to query profiles table directly in RLS policies
CREATE OR REPLACE FUNCTION public.user_can_access_school_content(content_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles p1, public.profiles p2
    WHERE p1.user_id = auth.uid()
      AND p2.user_id = content_user_id
      AND p1.school_id = p2.school_id
      AND p1.school_id IS NOT NULL
  );
$$;