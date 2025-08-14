-- Update schools data to include college.harvard.edu domain
UPDATE public.schools 
SET domain_whitelist = ARRAY['harvard.edu', 'college.harvard.edu']
WHERE name = 'Harvard University';

-- Verify the update
SELECT name, domain_whitelist FROM public.schools WHERE name = 'Harvard University';