-- Drop the problematic view
DROP VIEW IF EXISTS public.dorm_profiles_public;

-- Instead, let's ensure the SavedDorms page uses the secure function
-- The issue is that the frontend should ONLY use the secure functions we created
-- Let's verify the RLS policy is working correctly

-- Test the current policy by trying to select with different users
-- The RLS policy now requires authentication and same-school access

-- Let's also ensure anon users can't access the table at all
CREATE POLICY "Block anon access to dorm profiles" 
ON public.dorm_profiles 
FOR SELECT 
TO anon
USING (false);

-- Verify authenticated users can only see profiles from their school
-- The existing policy should handle this