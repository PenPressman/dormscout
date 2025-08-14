-- Add foreign key constraint for saved_dorms to dorm_profiles
ALTER TABLE public.saved_dorms 
ADD CONSTRAINT saved_dorms_dorm_profile_id_fkey 
FOREIGN KEY (dorm_profile_id) 
REFERENCES public.dorm_profiles(id) 
ON DELETE CASCADE;