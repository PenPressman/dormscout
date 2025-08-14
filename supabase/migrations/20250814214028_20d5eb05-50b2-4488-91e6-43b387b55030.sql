-- Create a secure function to determine if contact info should be visible
CREATE OR REPLACE FUNCTION public.can_view_contact_info(profile_user_id uuid, profile_school_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT CASE 
    WHEN auth.uid() IS NULL THEN false
    WHEN auth.uid() = profile_user_id THEN true
    WHEN public.get_user_school_id(auth.uid()) = profile_school_id THEN true
    ELSE false
  END;
$function$;

-- Drop the overly permissive policy that exposes all data
DROP POLICY IF EXISTS "Published dorm profiles are viewable by everyone" ON public.dorm_profiles;

-- Create a new policy that masks contact information for non-authorized users
CREATE POLICY "Published dorm profiles with contact masking" 
ON public.dorm_profiles 
FOR SELECT 
USING (
  published = true 
  AND CASE 
    WHEN public.can_view_contact_info(user_id, school_id) THEN true
    ELSE contact_email IS NULL  -- This will never be true for existing rows, effectively hiding them
  END
);

-- Since we can't mask individual columns in RLS, we need to restrict access
-- and ensure frontend only uses secure functions
-- Let's create a more restrictive approach

DROP POLICY IF EXISTS "Published dorm profiles with contact masking" ON public.dorm_profiles;

-- Only allow viewing published profiles to authenticated users from same school or profile owners
CREATE POLICY "Published dorm profiles - school access only" 
ON public.dorm_profiles 
FOR SELECT 
USING (
  published = true 
  AND (
    auth.uid() = user_id 
    OR public.get_user_school_id(auth.uid()) = school_id
  )
);

-- Create a public view for non-sensitive dorm profile data
CREATE OR REPLACE VIEW public.dorm_profiles_public AS
SELECT 
  id,
  user_id,
  school_id,
  dorm_name,
  room_number,
  photos_empty,
  photos_decorated,
  notes,
  published,
  created_at,
  updated_at,
  false as contact_enabled,
  null::text as contact_first_name,
  null::text as contact_last_initial,
  null::text as contact_email
FROM dorm_profiles
WHERE published = true;

-- Grant access to the public view
GRANT SELECT ON public.dorm_profiles_public TO anon, authenticated;