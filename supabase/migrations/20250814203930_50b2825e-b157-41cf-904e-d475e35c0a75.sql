-- Add saved_dorms table for user favorites
CREATE TABLE public.saved_dorms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  dorm_profile_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, dorm_profile_id)
);

-- Enable RLS
ALTER TABLE public.saved_dorms ENABLE ROW LEVEL SECURITY;

-- RLS policies for saved_dorms
CREATE POLICY "Users can view their own saved dorms" 
ON public.saved_dorms 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can save their own dorms" 
ON public.saved_dorms 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own saved dorms" 
ON public.saved_dorms 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add contact info fields to dorm_profiles
ALTER TABLE public.dorm_profiles 
ADD COLUMN contact_enabled boolean NOT NULL DEFAULT false,
ADD COLUMN contact_email text,
ADD COLUMN contact_first_name text,
ADD COLUMN contact_last_initial text;

-- Update schools data with specific universities and their domains
TRUNCATE TABLE public.schools CASCADE;

INSERT INTO public.schools (name, domain_whitelist, primary_color) VALUES
('Princeton University', ARRAY['princeton.edu'], '#FF8F00'),
('Massachusetts Institute of Technology', ARRAY['mit.edu'], '#8C1515'),
('Harvard University', ARRAY['harvard.edu', 'college.harvard.edu'], '#A51C30'),
('Stanford University', ARRAY['stanford.edu'], '#8C1515'),
('Yale University', ARRAY['yale.edu'], '#00356B'),
('California Institute of Technology', ARRAY['caltech.edu'], '#FF6C0C'),
('Duke University', ARRAY['duke.edu'], '#003087'),
('Johns Hopkins University', ARRAY['jhu.edu'], '#002D72'),
('Northwestern University', ARRAY['northwestern.edu'], '#4E2A84'),
('University of Pennsylvania', ARRAY['upenn.edu'], '#011F5B'),
('Cornell University', ARRAY['cornell.edu'], '#B31B1B'),
('University of Chicago', ARRAY['uchicago.edu'], '#800000'),
('Brown University', ARRAY['brown.edu'], '#ED1C24'),
('Columbia University', ARRAY['columbia.edu'], '#B9D9EB'),
('Dartmouth College', ARRAY['dartmouth.edu'], '#00693E'),
('University of California – Los Angeles', ARRAY['ucla.edu'], '#003B5C'),
('University of California – Berkeley', ARRAY['berkeley.edu'], '#003262'),
('University of Michigan–Ann Arbor', ARRAY['umich.edu'], '#00274C'),
('Rice University', ARRAY['rice.edu'], '#003A70'),
('Vanderbilt University', ARRAY['vanderbilt.edu'], '#866D4B'),
('Carnegie Mellon University', ARRAY['cmu.edu'], '#C41230'),
('University of Southern California', ARRAY['usc.edu'], '#990000'),
('University of Texas at Austin', ARRAY['utexas.edu'], '#BF5700'),
('Washington University in St. Louis', ARRAY['wustl.edu'], '#A51417'),
('University of California – San Diego', ARRAY['ucsd.edu'], '#182B49'),
('Boston University', ARRAY['bu.edu'], '#CC0000'),
('University of Maryland – College Park', ARRAY['umd.edu'], '#E21833');