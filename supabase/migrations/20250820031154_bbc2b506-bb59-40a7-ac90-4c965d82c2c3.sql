-- Create admin function to get all profiles (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_all_profiles_admin()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  email text,
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
SET search_path = public
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

-- Create admin function to get profile counts (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS TABLE(
  total_users bigint,
  total_schools bigint,
  total_dorms bigint,
  total_posts bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    (SELECT COUNT(*) FROM public.profiles) as total_users,
    (SELECT COUNT(*) FROM public.schools) as total_schools,
    (SELECT COUNT(*) FROM public.dorm_profiles) as total_dorms,
    (SELECT COUNT(*) FROM public.posts) as total_posts;
END;
$$;

-- Create admin function to get all dorm profiles (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_all_dorm_profiles_admin()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  school_id uuid,
  dorm_name text,
  room_number text,
  notes text,
  published boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  contact_enabled boolean,
  contact_first_name text,
  contact_last_initial text,
  contact_email text,
  photos_empty text[],
  photos_decorated text[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    dp.id,
    dp.user_id,
    dp.school_id,
    dp.dorm_name,
    dp.room_number,
    dp.notes,
    dp.published,
    dp.created_at,
    dp.updated_at,
    dp.contact_enabled,
    dp.contact_first_name,
    dp.contact_last_initial,
    dp.contact_email,
    dp.photos_empty,
    dp.photos_decorated
  FROM public.dorm_profiles dp
  ORDER BY dp.created_at DESC;
END;
$$;