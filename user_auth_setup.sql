-- GOSHEN CLOTHING - USER AUTH & ACCOUNT SYSTEM SETUP

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    provider TEXT DEFAULT 'email',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile." 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile." 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 2. TWO-FACTOR VERIFICATION TABLE
CREATE TABLE IF NOT EXISTS public.two_factor (
    user_id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    pin TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on two_factor
ALTER TABLE public.two_factor ENABLE ROW LEVEL SECURITY;

-- Two-Factor Policies (Service Role will handle most writes, but user can read their status)
CREATE POLICY "Users can view their own 2FA status." 
ON public.two_factor FOR SELECT 
USING (auth.uid() = user_id);

-- 3. AUTOMATIC PROFILE CREATION TRIGGER
-- This function inserts a row into public.profiles whenever a new user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, provider)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_app_meta_data->>'provider', 'email')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. STORAGE BUCKET FOR AVATARS
-- Note: This part might need to be done in the Supabase UI or via API
-- INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true);

-- Storage Policies for avatars (Assuming bucket 'profiles' exists)
-- CREATE POLICY "Avatar images are publicly accessible." ON storage.objects FOR SELECT USING (bucket_id = 'profiles');
-- CREATE POLICY "Users can upload their own avatar." ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users can update their own avatar." ON storage.objects FOR UPDATE USING (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);
