-- Add policy to allow viewing published dorm profiles from same school
CREATE POLICY "Users can view published profiles from same school" 
ON public.dorm_profiles 
FOR SELECT 
USING (
  published = true 
  AND school_id = get_user_school_id(auth.uid())
);