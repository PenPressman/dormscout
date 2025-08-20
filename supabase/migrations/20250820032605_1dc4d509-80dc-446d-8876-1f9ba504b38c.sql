-- Add name fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text;

-- Drop and recreate the admin profiles function with name fields
DROP FUNCTION IF EXISTS public.get_all_profiles_admin();

CREATE OR REPLACE FUNCTION public.get_all_profiles_admin()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  email text,
  first_name text,
  last_name text,
  school_id uuid,
  role app_role,
  verified_at timestamp with time zone,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  latest_tos_version text,
  latest_privacy_version text,
  latest_consented_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow access to admin users
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.school_id,
    p.role,
    p.verified_at,
    p.created_at,
    p.updated_at,
    p.latest_tos_version,
    p.latest_privacy_version,
    p.latest_consented_at
  FROM public.profiles p
  ORDER BY p.created_at DESC;
END;
$$;

-- Create admin function to get all posts with user and room details
CREATE OR REPLACE FUNCTION public.get_all_posts_admin()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  room_id uuid,
  title text,
  content text,
  tags text[],
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  user_email text,
  user_first_name text,
  user_last_name text,
  school_name text,
  building_name text,
  room_number text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only allow access to admin users
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.room_id,
    p.title,
    p.content,
    p.tags,
    p.created_at,
    p.updated_at,
    prof.email as user_email,
    prof.first_name as user_first_name,
    prof.last_name as user_last_name,
    s.name as school_name,
    b.name as building_name,
    r.room_number
  FROM public.posts p
  LEFT JOIN public.profiles prof ON prof.user_id = p.user_id
  LEFT JOIN public.rooms r ON r.id = p.room_id
  LEFT JOIN public.buildings b ON b.id = r.building_id
  LEFT JOIN public.schools s ON s.id = b.school_id
  ORDER BY p.created_at DESC;
END;
$$;