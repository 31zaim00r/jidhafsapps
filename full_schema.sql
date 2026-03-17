
-- ENUMS
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_type') THEN
        CREATE TYPE user_role_type AS ENUM ('admin', 'user');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'poem_category') THEN
        CREATE TYPE poem_category AS ENUM ('وقفة', 'موشح', 'متعدد الأوزان');
    END IF;
END $$;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone_number TEXT,
    can_upload BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    role user_role_type DEFAULT 'user',
    UNIQUE(user_id)
);

-- 3. Occasions Table
CREATE TABLE IF NOT EXISTS public.occasions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- flame, heart, star, moon, etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Poems Table
CREATE TABLE IF NOT EXISTS public.poems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    poet_name TEXT NOT NULL,
    year INTEGER,
    category poem_category,
    content TEXT, -- Not used in UI but requested in schema
    media_url TEXT,
    occasion_id UUID REFERENCES public.occasions(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- TRIGGERS for Profile creation on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', 'مستخدم'), new.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occasions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;

-- Helper Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin' 
    FROM public.user_roles 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLICIES: Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (is_admin());

-- POLICIES: User Roles
CREATE POLICY "Roles viewable by admin" ON public.user_roles FOR SELECT USING (is_admin());
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (is_admin());

-- POLICIES: Occasions
CREATE POLICY "Active occasions are viewable by everyone" ON public.occasions FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Admins manage occasions" ON public.occasions FOR ALL USING (is_admin());

-- POLICIES: Poems
CREATE POLICY "Poems are viewable by everyone" ON public.poems FOR SELECT USING (true);
CREATE POLICY "Users with can_upload can insert poems" ON public.poems FOR INSERT WITH CHECK (
    (SELECT can_upload FROM public.profiles WHERE id = auth.uid()) = true OR is_admin()
);
CREATE POLICY "Users can update own poems" ON public.poems FOR UPDATE USING (auth.uid() = created_by OR is_admin());
CREATE POLICY "Users can delete own poems" ON public.poems FOR DELETE USING (auth.uid() = created_by OR is_admin());

-- STORAGE: Create Bucket if not exists
-- Move this to your dashboard usually, but here is the logic
-- INSERT INTO storage.buckets (id, name, public) VALUES ('poem-media', 'poem-media', true);

-- STORAGE POLICIES
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'poem-media');
-- CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'poem-media' AND auth.role() = 'authenticated');
