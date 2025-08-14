-- Fix remaining functions with search_path issues

-- Fix get_public_profile function
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_user_id uuid)
 RETURNS TABLE(id uuid, user_id uuid, school_id uuid, role app_role, verified_at timestamp with time zone, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

-- Fix user_can_access_school_content function
CREATE OR REPLACE FUNCTION public.user_can_access_school_content(content_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles p1, public.profiles p2
    WHERE p1.user_id = auth.uid()
      AND p2.user_id = content_user_id
      AND p1.school_id = p2.school_id
      AND p1.school_id IS NOT NULL
  );
$function$;

-- Fix get_dorm_profile_secure function
CREATE OR REPLACE FUNCTION public.get_dorm_profile_secure(profile_id uuid)
 RETURNS TABLE(id uuid, user_id uuid, school_id uuid, dorm_name text, room_number text, photos_empty text[], photos_decorated text[], notes text, published boolean, created_at timestamp with time zone, updated_at timestamp with time zone, contact_enabled boolean, contact_first_name text, contact_last_initial text, contact_email text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_school_id uuid;
  profile_user_id uuid;
  profile_school_id uuid;
BEGIN
  -- Get the user's school ID
  SELECT get_user_school_id(auth.uid()) INTO user_school_id;
  
  -- Get the profile's user_id and school_id
  SELECT dp.user_id, dp.school_id INTO profile_user_id, profile_school_id
  FROM dorm_profiles dp
  WHERE dp.id = profile_id AND dp.published = true;
  
  -- If profile doesn't exist or isn't published, return empty
  IF profile_user_id IS NULL THEN
    RETURN;
  END IF;
  
  -- Return full data if user owns the profile or is from same school
  IF auth.uid() = profile_user_id OR user_school_id = profile_school_id THEN
    RETURN QUERY
    SELECT 
      dp.id,
      dp.user_id,
      dp.school_id,
      dp.dorm_name,
      dp.room_number,
      dp.photos_empty,
      dp.photos_decorated,
      dp.notes,
      dp.published,
      dp.created_at,
      dp.updated_at,
      dp.contact_enabled,
      dp.contact_first_name,
      dp.contact_last_initial,
      dp.contact_email
    FROM dorm_profiles dp
    WHERE dp.id = profile_id AND dp.published = true;
  ELSE
    -- Return data without contact info for other users
    RETURN QUERY
    SELECT 
      dp.id,
      dp.user_id,
      dp.school_id,
      dp.dorm_name,
      dp.room_number,
      dp.photos_empty,
      dp.photos_decorated,
      dp.notes,
      dp.published,
      dp.created_at,
      dp.updated_at,
      false::boolean as contact_enabled,
      null::text as contact_first_name,
      null::text as contact_last_initial,
      null::text as contact_email
    FROM dorm_profiles dp
    WHERE dp.id = profile_id AND dp.published = true;
  END IF;
END;
$function$;

-- Fix search_dorm_profiles_secure function
CREATE OR REPLACE FUNCTION public.search_dorm_profiles_secure(search_term text DEFAULT ''::text, filter_school_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(id uuid, user_id uuid, school_id uuid, dorm_name text, room_number text, photos_empty text[], photos_decorated text[], notes text, published boolean, created_at timestamp with time zone, updated_at timestamp with time zone, contact_enabled boolean, contact_first_name text, contact_last_initial text, contact_email text, school_name text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_school_id uuid;
BEGIN
  -- Get the user's school ID
  SELECT get_user_school_id(auth.uid()) INTO user_school_id;
  
  RETURN QUERY
  SELECT 
    dp.id,
    dp.user_id,
    dp.school_id,
    dp.dorm_name,
    dp.room_number,
    dp.photos_empty,
    dp.photos_decorated,
    dp.notes,
    dp.published,
    dp.created_at,
    dp.updated_at,
    -- Only return contact info if user owns the profile or is from same school
    CASE 
      WHEN auth.uid() = dp.user_id OR user_school_id = dp.school_id 
      THEN dp.contact_enabled 
      ELSE false 
    END as contact_enabled,
    CASE 
      WHEN auth.uid() = dp.user_id OR user_school_id = dp.school_id 
      THEN dp.contact_first_name 
      ELSE null 
    END as contact_first_name,
    CASE 
      WHEN auth.uid() = dp.user_id OR user_school_id = dp.school_id 
      THEN dp.contact_last_initial 
      ELSE null 
    END as contact_last_initial,
    CASE 
      WHEN auth.uid() = dp.user_id OR user_school_id = dp.school_id 
      THEN dp.contact_email 
      ELSE null 
    END as contact_email,
    s.name as school_name
  FROM dorm_profiles dp
  JOIN schools s ON dp.school_id = s.id
  WHERE dp.published = true
    AND (filter_school_id IS NULL OR dp.school_id = filter_school_id)
    AND (search_term = '' OR 
         dp.dorm_name ILIKE '%' || search_term || '%' OR
         dp.room_number ILIKE '%' || search_term || '%' OR
         dp.notes ILIKE '%' || search_term || '%' OR
         s.name ILIKE '%' || search_term || '%')
  ORDER BY dp.created_at DESC;
END;
$function$;