-- Let's check what policies exist and remove any that allow public access
-- First, let's see all policies on dorm_profiles

-- Remove all existing SELECT policies that might allow public access
DROP POLICY IF EXISTS "Published dorm profiles - school access only" ON public.dorm_profiles;
DROP POLICY IF EXISTS "Block anon access to dorm profiles" ON public.dorm_profiles;

-- Create a strict policy: only authenticated users can see published profiles from their own school OR their own profiles
CREATE POLICY "Authenticated users - own school or own profiles only" 
ON public.dorm_profiles 
FOR SELECT 
TO authenticated
USING (
  (published = true AND public.get_user_school_id(auth.uid()) = school_id)
  OR (auth.uid() = user_id)
);

-- Ensure anon users have NO access
CREATE POLICY "Block all anon access to dorm profiles" 
ON public.dorm_profiles 
FOR ALL
TO anon
USING (false)
WITH CHECK (false);

-- Test that anon users can't access anything
RESET ROLE;