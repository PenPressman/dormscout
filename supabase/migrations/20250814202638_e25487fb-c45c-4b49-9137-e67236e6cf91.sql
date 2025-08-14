-- Create dorm_profiles table for Dorm Scout
CREATE TABLE public.dorm_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  dorm_name TEXT NOT NULL,
  room_number TEXT,
  photos_empty TEXT[],
  photos_decorated TEXT[],
  notes TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.dorm_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for dorm profiles
-- Users can view published profiles
CREATE POLICY "Published dorm profiles are viewable by everyone" 
ON public.dorm_profiles 
FOR SELECT 
USING (published = true);

-- Users can view their own profiles (published or not)
CREATE POLICY "Users can view their own dorm profiles" 
ON public.dorm_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create their own profiles
CREATE POLICY "Users can create their own dorm profiles" 
ON public.dorm_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profiles
CREATE POLICY "Users can update their own dorm profiles" 
ON public.dorm_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own profiles
CREATE POLICY "Users can delete their own dorm profiles" 
ON public.dorm_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage bucket for dorm photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('dorm-photos', 'dorm-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for dorm photos
CREATE POLICY "Dorm photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'dorm-photos');

CREATE POLICY "Users can upload dorm photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'dorm-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own dorm photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'dorm-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own dorm photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'dorm-photos' AND auth.uid() IS NOT NULL);

-- Add primary_color column to schools table if it doesn't exist
ALTER TABLE public.schools 
ADD COLUMN IF NOT EXISTS primary_color TEXT;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_dorm_profiles_updated_at
BEFORE UPDATE ON public.dorm_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();