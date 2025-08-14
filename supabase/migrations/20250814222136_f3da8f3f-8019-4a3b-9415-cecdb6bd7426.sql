-- Create user_consents table for tracking legal consents
CREATE TABLE public.user_consents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tos_version text NOT NULL,
  privacy_version text NOT NULL,
  consented_at timestamp with time zone NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_user_consents_user_id ON public.user_consents(user_id);
CREATE INDEX idx_user_consents_created_at ON public.user_consents(created_at DESC);

-- Enable RLS
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_consents
CREATE POLICY "Users can view their own consents" 
ON public.user_consents 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System can insert consents" 
ON public.user_consents 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add consent tracking fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN latest_tos_version text,
ADD COLUMN latest_privacy_version text,
ADD COLUMN latest_consented_at timestamp with time zone;

-- Create trigger for user_consents updated_at
CREATE TRIGGER update_user_consents_updated_at
BEFORE UPDATE ON public.user_consents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();