-- Jidhafs Mobile App - Consolidated Supabase Schema
-- This file contains the complete database structure, RLS policies, and storage setup.

-- 1. ENUMS
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_type') THEN
        CREATE TYPE user_role_type AS ENUM ('admin', 'user');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'poem_category') THEN
        CREATE TYPE poem_category AS ENUM ('وقفة', 'موشح', 'متعدد الأوزان');
    END IF;
END $$;

-- 2. Profiles Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone_number TEXT,
    can_upload BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    role user_role_type DEFAULT 'user',
    UNIQUE(user_id)
);

-- 4. Occasions Table
CREATE TABLE IF NOT EXISTS public.occasions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Poems Table
CREATE TABLE IF NOT EXISTS public.poems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    poet_name TEXT NOT NULL,
    year INTEGER,
    category poem_category,
    content TEXT, 
    media_url TEXT,
    occasion_id UUID REFERENCES public.occasions(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    poem_id UUID REFERENCES public.poems(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, poem_id)
);

-- 7. Trigger for Profile Creation on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  is_first_user BOOLEAN;
BEGIN
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles) INTO is_first_user;

  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'مستخدم جديد'), new.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    new.id, 
    CASE WHEN is_first_user THEN 'admin'::user_role_type ELSE 'user'::user_role_type END
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occasions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 9. Helper Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role::text = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 10. RLS POLICIES

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (is_admin());

-- User Roles
CREATE POLICY "Roles viewable by admin" ON public.user_roles FOR SELECT USING (is_admin());
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (is_admin());

-- Favorites
CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Occasions
CREATE POLICY "occasions_read_policy" ON public.occasions FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "occasions_admin_policy" ON public.occasions FOR ALL USING (is_admin());

-- Poems
CREATE POLICY "Poems view policy" ON public.poems FOR SELECT USING (true);
CREATE POLICY "Poems insert policy" ON public.poems FOR INSERT WITH CHECK (
    (SELECT can_upload FROM public.profiles WHERE id = auth.uid()) = true OR is_admin()
);
CREATE POLICY "Poems update policy" ON public.poems FOR UPDATE USING (auth.uid() = created_by OR is_admin());
CREATE POLICY "Poems delete policy" ON public.poems FOR DELETE USING (auth.uid() = created_by OR is_admin());

-- 11. STORAGE SETUP (Buckets)
-- To be run in Supabase SQL Editor or via API if permissions allow
-- INSERT INTO storage.buckets (id, name, public) VALUES ('occasion-images', 'occasion-images', true) ON CONFLICT (id) DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('poem-media', 'poem-media', true) ON CONFLICT (id) DO NOTHING;

-- 12. INITIAL DATA
INSERT INTO public.occasions (name, is_active) VALUES 
('عاشوراء', true), 
('مولد النبي', true), 
('وفاة الإمام علي', true), 
('ليالي القدر', true), 
('عيد الفطر', true)
ON CONFLICT DO NOTHING;
