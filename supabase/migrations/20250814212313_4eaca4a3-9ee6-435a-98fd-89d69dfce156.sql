-- Create a secure function to get dorm profiles with proper contact info access control
CREATE OR REPLACE FUNCTION public.get_dorm_profile_secure(profile_id uuid)
RETURNS TABLE(
  id uuid,
  dorm_name text,
  room_number text,
  photos_empty text[],
  photos_decorated text,
  notes text,
  published boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  school_id uuid,
  user_id uuid,
  -- Contact info only returned if user is from same school
  contact_enabled boolean,
  contact_first_name text,
  contact_last_initial text,
  contact_email text
) 
LANGUAGE sql 
STABLE SECURITY DEFINER 
SET search_path TO 'public'
AS $$
  SELECT 
    dp.id,
    dp.dorm_name,
    dp.room_number,
    dp.photos_empty,
    dp.photos_decorated,
    dp.notes,
    dp.published,
    dp.created_at,
    dp.updated_at,
    dp.school_id,
    dp.user_id,
    -- Only return contact info if user is from same school or owns the profile
    CASE 
      WHEN auth.uid() = dp.user_id OR 
           (auth.uid() IS NOT NULL AND dp.school_id = public.get_user_school_id(auth.uid()))
      THEN dp.contact_enabled 
      ELSE false 
    END as contact_enabled,
    CASE 
      WHEN auth.uid() = dp.user_id OR 
           (auth.uid() IS NOT NULL AND dp.school_id = public.get_user_school_id(auth.uid()))
      THEN dp.contact_first_name 
      ELSE NULL 
    END as contact_first_name,
    CASE 
      WHEN auth.uid() = dp.user_id OR 
           (auth.uid() IS NOT NULL AND dp.school_id = public.get_user_school_id(auth.uid()))
      THEN dp.contact_last_initial 
      ELSE NULL 
    END as contact_last_initial,
    CASE 
      WHEN auth.uid() = dp.user_id OR 
           (auth.uid() IS NOT NULL AND dp.school_id = public.get_user_school_id(auth.uid()))
      THEN dp.contact_email 
      ELSE NULL 
    END as contact_email
  FROM public.dorm_profiles dp
  WHERE dp.id = profile_id
    AND dp.published = true;
$$;

-- Create a secure function to search dorm profiles with proper contact info access control
CREATE OR REPLACE FUNCTION public.search_dorm_profiles_secure(
  search_school_id uuid,
  search_term text DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  dorm_name text,
  room_number text,
  photos_empty text[],
  photos_decorated text[],
  notes text,
  published boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  school_id uuid,
  user_id uuid,
  -- Contact info only returned if user is from same school
  contact_enabled boolean,
  contact_first_name text,
  contact_last_initial text,
  contact_email text
) 
LANGUAGE sql 
STABLE SECURITY DEFINER 
SET search_path TO 'public'
AS $$
  SELECT 
    dp.id,
    dp.dorm_name,
    dp.room_number,
    dp.photos_empty,
    dp.photos_decorated,
    dp.notes,
    dp.published,
    dp.created_at,
    dp.updated_at,
    dp.school_id,
    dp.user_id,
    -- Only return contact info if user is from same school
    CASE 
      WHEN auth.uid() IS NOT NULL AND dp.school_id = public.get_user_school_id(auth.uid())
      THEN dp.contact_enabled 
      ELSE false 
    END as contact_enabled,
    CASE 
      WHEN auth.uid() IS NOT NULL AND dp.school_id = public.get_user_school_id(auth.uid())
      THEN dp.contact_first_name 
      ELSE NULL 
    END as contact_first_name,
    CASE 
      WHEN auth.uid() IS NOT NULL AND dp.school_id = public.get_user_school_id(auth.uid())
      THEN dp.contact_last_initial 
      ELSE NULL 
    END as contact_last_initial,
    CASE 
      WHEN auth.uid() IS NOT NULL AND dp.school_id = public.get_user_school_id(auth.uid())
      THEN dp.contact_email 
      ELSE NULL 
    END as contact_email
  FROM public.dorm_profiles dp
  WHERE dp.school_id = search_school_id
    AND dp.published = true
    AND (
      search_term IS NULL OR
      dp.dorm_name ILIKE '%' || search_term || '%' OR
      dp.room_number ILIKE '%' || search_term || '%' OR
      dp.notes ILIKE '%' || search_term || '%'
    )
  ORDER BY dp.created_at DESC
  LIMIT 20;
$$;