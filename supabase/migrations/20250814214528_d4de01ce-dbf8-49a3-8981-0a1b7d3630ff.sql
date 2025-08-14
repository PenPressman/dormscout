-- Let's see what's happening. First check if there are other policies
-- Remove ANY policy that might grant public access
DO $$
DECLARE
    r record;
BEGIN
    -- Drop all existing policies on dorm_profiles
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'dorm_profiles' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.dorm_profiles';
    END LOOP;
END$$;

-- Now create only the necessary policies
-- 1. Users can view their own profiles (published or not)
CREATE POLICY "Users can view own profiles" 
ON public.dorm_profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- 2. Users can create their own profiles  
CREATE POLICY "Users can create own profiles" 
ON public.dorm_profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own profiles
CREATE POLICY "Users can update own profiles" 
ON public.dorm_profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- 4. Users can delete their own profiles
CREATE POLICY "Users can delete own profiles" 
ON public.dorm_profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- 5. For published profiles, ONLY allow access via secure functions
-- Remove any direct SELECT access to published profiles that aren't owned by the user

-- The key insight: We should NOT have any policy that allows selecting published profiles
-- All access to published profiles should go through the secure functions only