-- Fix the trigger function to bypass RLS for profile creation
-- The issue is that RLS prevents the trigger from inserting the profile

-- First, let's create a function that can insert profiles with elevated privileges
CREATE OR REPLACE FUNCTION public.create_user_profile(
  new_user_id UUID,
  new_email TEXT,
  new_school_id UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile with security definer privileges (bypasses RLS)
  INSERT INTO public.profiles (user_id, email, school_id)
  VALUES (new_user_id, new_email, new_school_id);
END;
$$;

-- Update the trigger function to use the new secure function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
  user_school_id UUID;
BEGIN
  user_email := NEW.email;
  
  -- Find school by email domain
  SELECT id INTO user_school_id 
  FROM public.schools 
  WHERE user_email LIKE '%@' || ANY(domain_whitelist);
  
  -- Use the secure function to create profile
  PERFORM public.create_user_profile(NEW.id, user_email, user_school_id);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and re-raise it
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RAISE;
END;
$$;