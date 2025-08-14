-- Fix function search path issues
CREATE OR REPLACE FUNCTION public.get_user_school_id(user_uuid UUID)
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT school_id FROM public.profiles WHERE user_id = user_uuid;
$$;

-- Create function to handle new user signup with proper search path
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
  
  -- Insert profile
  INSERT INTO public.profiles (user_id, email, school_id)
  VALUES (NEW.id, user_email, user_school_id);
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create RLS policies for schools
DROP POLICY IF EXISTS "Users can view schools" ON public.schools;
CREATE POLICY "Users can view schools" ON public.schools
  FOR SELECT USING (true);

-- Create RLS policies for buildings
DROP POLICY IF EXISTS "Users can view buildings from their school" ON public.buildings;
CREATE POLICY "Users can view buildings from their school" ON public.buildings
  FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));

DROP POLICY IF EXISTS "Users can insert buildings for their school" ON public.buildings;
CREATE POLICY "Users can insert buildings for their school" ON public.buildings
  FOR INSERT WITH CHECK (school_id = public.get_user_school_id(auth.uid()));

-- Create RLS policies for rooms
DROP POLICY IF EXISTS "Users can view rooms from their school" ON public.rooms;
CREATE POLICY "Users can view rooms from their school" ON public.rooms
  FOR SELECT USING (
    (SELECT school_id FROM public.buildings WHERE id = building_id) = public.get_user_school_id(auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert rooms for their school" ON public.rooms;
CREATE POLICY "Users can insert rooms for their school" ON public.rooms
  FOR INSERT WITH CHECK (
    (SELECT school_id FROM public.buildings WHERE id = building_id) = public.get_user_school_id(auth.uid())
  );

-- Create RLS policies for profiles
DROP POLICY IF EXISTS "Users can view profiles from their school" ON public.profiles;
CREATE POLICY "Users can view profiles from their school" ON public.profiles
  FOR SELECT USING (school_id = public.get_user_school_id(auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid());

-- Create RLS policies for photos
DROP POLICY IF EXISTS "Users can view photos from their school" ON public.photos;
CREATE POLICY "Users can view photos from their school" ON public.photos
  FOR SELECT USING (
    (SELECT public.get_user_school_id(auth.uid())) = 
    (SELECT buildings.school_id FROM public.buildings 
     JOIN public.rooms ON buildings.id = rooms.building_id 
     WHERE rooms.id = room_id)
  );

DROP POLICY IF EXISTS "Users can insert photos for their school" ON public.photos;
CREATE POLICY "Users can insert photos for their school" ON public.photos
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    (SELECT public.get_user_school_id(auth.uid())) = 
    (SELECT buildings.school_id FROM public.buildings 
     JOIN public.rooms ON buildings.id = rooms.building_id 
     WHERE rooms.id = room_id)
  );

DROP POLICY IF EXISTS "Users can update their own photos" ON public.photos;
CREATE POLICY "Users can update their own photos" ON public.photos
  FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own photos" ON public.photos;
CREATE POLICY "Users can delete their own photos" ON public.photos
  FOR DELETE USING (user_id = auth.uid());

-- Create RLS policies for posts
DROP POLICY IF EXISTS "Users can view posts from their school" ON public.posts;
CREATE POLICY "Users can view posts from their school" ON public.posts
  FOR SELECT USING (
    (SELECT public.get_user_school_id(auth.uid())) = 
    (SELECT buildings.school_id FROM public.buildings 
     JOIN public.rooms ON buildings.id = rooms.building_id 
     WHERE rooms.id = room_id)
  );

DROP POLICY IF EXISTS "Users can insert posts for their school" ON public.posts;
CREATE POLICY "Users can insert posts for their school" ON public.posts
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    (SELECT public.get_user_school_id(auth.uid())) = 
    (SELECT buildings.school_id FROM public.buildings 
     JOIN public.rooms ON buildings.id = rooms.building_id 
     WHERE rooms.id = room_id)
  );

DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
CREATE POLICY "Users can update their own posts" ON public.posts
  FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
CREATE POLICY "Users can delete their own posts" ON public.posts
  FOR DELETE USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_buildings_school_id ON public.buildings(school_id);
CREATE INDEX IF NOT EXISTS idx_rooms_building_id ON public.rooms(building_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON public.profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_photos_room_id ON public.photos(room_id);
CREATE INDEX IF NOT EXISTS idx_photos_user_id ON public.photos(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_room_id ON public.posts(room_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);