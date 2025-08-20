-- Update penelope.pressman@gmail.com to admin role
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'penelope.pressman@gmail.com';