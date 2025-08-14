-- Fix security issues by updating functions with proper search_path settings

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

-- Fix get_user_school_id function
CREATE OR REPLACE FUNCTION public.get_user_school_id(user_uuid uuid)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT school_id FROM public.profiles WHERE user_id = user_uuid;
$function$;

-- Fix create_user_profile function
CREATE OR REPLACE FUNCTION public.create_user_profile(new_user_id uuid, new_email text, new_school_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert profile with security definer privileges (bypasses RLS)
  INSERT INTO public.profiles (user_id, email, school_id)
  VALUES (new_user_id, new_email, new_school_id);
END;
$function$;