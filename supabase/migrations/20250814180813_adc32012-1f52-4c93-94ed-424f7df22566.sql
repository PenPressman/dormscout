-- Fix domain matching logic in handle_new_user trigger
-- The issue is with how we're matching email domains

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
  email_domain TEXT;
  user_school_id UUID;
BEGIN
  user_email := NEW.email;
  
  -- Extract domain from email (everything after @)
  email_domain := split_part(user_email, '@', 2);
  
  -- Find school by email domain
  SELECT id INTO user_school_id 
  FROM public.schools 
  WHERE email_domain = ANY(domain_whitelist);
  
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