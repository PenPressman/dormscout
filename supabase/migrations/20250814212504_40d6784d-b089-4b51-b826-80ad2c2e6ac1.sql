-- Fix the secure functions to return proper array types for photos
DROP FUNCTION IF EXISTS get_dorm_profile_secure(uuid);
DROP FUNCTION IF EXISTS search_dorm_profiles_secure(text, uuid);

-- Recreate get_dorm_profile_secure with proper array handling
CREATE OR REPLACE FUNCTION get_dorm_profile_secure(profile_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  school_id uuid,
  dorm_name text,
  room_number text,
  photos_empty text[],
  photos_decorated text[],
  notes text,
  published boolean,
  created_at timestamptz,
  updated_at timestamptz,
  contact_enabled boolean,
  contact_first_name text,
  contact_last_initial text,
  contact_email text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Recreate search_dorm_profiles_secure with proper array handling
CREATE OR REPLACE FUNCTION search_dorm_profiles_secure(
  search_term text DEFAULT '',
  filter_school_id uuid DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  school_id uuid,
  dorm_name text,
  room_number text,
  photos_empty text[],
  photos_decorated text[],
  notes text,
  published boolean,
  created_at timestamptz,
  updated_at timestamptz,
  contact_enabled boolean,
  contact_first_name text,
  contact_last_initial text,
  contact_email text,
  school_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;