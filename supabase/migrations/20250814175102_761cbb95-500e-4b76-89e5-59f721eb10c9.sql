-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('user', 'moderator', 'admin');

-- Create enum for photo types
CREATE TYPE public.photo_type AS ENUM ('empty', 'designed', 'detail');

-- Create schools table
CREATE TABLE public.schools (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    domain_whitelist TEXT[] NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create buildings table
CREATE TABLE public.buildings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rooms table
CREATE TABLE public.rooms (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    building_id UUID NOT NULL REFERENCES public.buildings(id) ON DELETE CASCADE,
    room_number TEXT NOT NULL,
    floor INTEGER,
    room_type TEXT,
    bed_type TEXT,
    dimensions TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(building_id, room_number)
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Create photos table
CREATE TABLE public.photos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    photo_type photo_type NOT NULL DEFAULT 'designed',
    storage_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    taken_at TIMESTAMP WITH TIME ZONE,
    faces_blurred BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create posts table for tips and info
CREATE TABLE public.posts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create function to get user school
CREATE OR REPLACE FUNCTION public.get_user_school_id(user_uuid UUID)
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT school_id FROM public.profiles WHERE user_id = user_uuid;
$$;

-- Create RLS policies for schools
CREATE POLICY "Users can view schools" ON public.schools
  FOR SELECT USING (true);

-- Create RLS policies for buildings
CREATE POLICY "Users can view buildings from their school" ON public.buildings
  FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));

CREATE POLICY "Users can insert buildings for their school" ON public.buildings
  FOR INSERT WITH CHECK (school_id = public.get_user_school_id(auth.uid()));

-- Create RLS policies for rooms
CREATE POLICY "Users can view rooms from their school" ON public.rooms
  FOR SELECT USING (
    (SELECT school_id FROM public.buildings WHERE id = building_id) = public.get_user_school_id(auth.uid())
  );

CREATE POLICY "Users can insert rooms for their school" ON public.rooms
  FOR INSERT WITH CHECK (
    (SELECT school_id FROM public.buildings WHERE id = building_id) = public.get_user_school_id(auth.uid())
  );

-- Create RLS policies for profiles
CREATE POLICY "Users can view profiles from their school" ON public.profiles
  FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid());

-- Create RLS policies for photos
CREATE POLICY "Users can view photos from their school" ON public.photos
  FOR SELECT USING (
    (SELECT public.get_user_school_id(auth.uid())) = 
    (SELECT buildings.school_id FROM public.buildings 
     JOIN public.rooms ON buildings.id = rooms.building_id 
     WHERE rooms.id = room_id)
  );

CREATE POLICY "Users can insert photos for their school" ON public.photos
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    (SELECT public.get_user_school_id(auth.uid())) = 
    (SELECT buildings.school_id FROM public.buildings 
     JOIN public.rooms ON buildings.id = rooms.building_id 
     WHERE rooms.id = room_id)
  );

CREATE POLICY "Users can update their own photos" ON public.photos
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own photos" ON public.photos
  FOR DELETE USING (user_id = auth.uid());

-- Create RLS policies for posts
CREATE POLICY "Users can view posts from their school" ON public.posts
  FOR SELECT USING (
    (SELECT public.get_user_school_id(auth.uid())) = 
    (SELECT buildings.school_id FROM public.buildings 
     JOIN public.rooms ON buildings.id = rooms.building_id 
     WHERE rooms.id = room_id)
  );

CREATE POLICY "Users can insert posts for their school" ON public.posts
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    (SELECT public.get_user_school_id(auth.uid())) = 
    (SELECT buildings.school_id FROM public.buildings 
     JOIN public.rooms ON buildings.id = rooms.building_id 
     WHERE rooms.id = room_id)
  );

CREATE POLICY "Users can update their own posts" ON public.posts
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own posts" ON public.posts
  FOR DELETE USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_buildings_school_id ON public.buildings(school_id);
CREATE INDEX idx_rooms_building_id ON public.rooms(building_id);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_school_id ON public.profiles(school_id);
CREATE INDEX idx_photos_room_id ON public.photos(room_id);
CREATE INDEX idx_photos_user_id ON public.photos(user_id);
CREATE INDEX idx_posts_room_id ON public.posts(room_id);
CREATE INDEX idx_posts_user_id ON public.posts(user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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
  
  -- Insert profile
  INSERT INTO public.profiles (user_id, email, school_id)
  VALUES (NEW.id, user_email, user_school_id);
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO public.schools (name, domain_whitelist) VALUES 
  ('University of California, Berkeley', ARRAY['berkeley.edu']),
  ('Stanford University', ARRAY['stanford.edu']),
  ('Harvard University', ARRAY['harvard.edu']),
  ('MIT', ARRAY['mit.edu']);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_buildings_updated_at
  BEFORE UPDATE ON public.buildings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_photos_updated_at
  BEFORE UPDATE ON public.photos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();