-- GOSHEN CLOTHING - SUPABASE SECURITY SETUP SCRIPT
-- RUN THIS IN THE SUPABASE SQL EDITOR

-- 1. ENABLE ROW LEVEL SECURITY (RLS)
-- This locks down the tables so they can't be modified by default.
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- 2. PUBLIC READ POLICIES
-- Anyone can see the products and collections on the home page.
CREATE POLICY "Public products are viewable by everyone."
ON products FOR SELECT
USING (true);

CREATE POLICY "Public collections are viewable by everyone."
ON collections FOR SELECT
USING (true);

-- 3. ADMIN CRUD POLICIES (AUTHENTICATED & ROLE-BASED)
-- Only users with 'role': 'admin' in their metadata can C-R-U-D.
CREATE POLICY "Admins have full access to products"
ON products FOR ALL
TO authenticated
USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to collections"
ON collections FOR ALL
TO authenticated
USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- 4. STORAGE BUCKET POLICIES
-- Create bucket if it doesn't exist (handled via API or UI usually, but adding policies here)
-- Bucket name: 'profiles' for user avatars, 'products' for product images

-- PUBLIC BUCKET ACCESS
CREATE POLICY "Public profiles are viewable by everyone."
ON storage.objects FOR SELECT
USING (bucket_id = 'profiles');

CREATE POLICY "Public products are viewable by everyone."
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- ADMIN STORAGE ACCESS (ALL OPERATIONS)
CREATE POLICY "Admins have full access to storage"
ON storage.objects FOR ALL
TO authenticated
USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

-- USER STORAGE ACCESS (AVATAR ONLY)
CREATE POLICY "Users can upload their own avatar."
ON storage.objects FOR ALL
TO authenticated
USING (
    bucket_id = 'profiles' AND 
    (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'profiles' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. STEP-BY-STEP INSTRUCTIONS:
-- a) Go to 'Authentication' -> 'Users' -> 'Add user' -> 'Create new user'.
-- b) Add email: 'Mawuo247@gmail.com' and a strong password.
-- c) After the user is created, copy the script below and run it to grant admin rights:

/*
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'
WHERE email = 'Mawuo247@gmail.com';
*/

