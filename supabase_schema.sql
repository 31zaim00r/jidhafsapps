
-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER',
    profile_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.occasions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.poems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    poet_name TEXT NOT NULL,
    occasion_id INTEGER REFERENCES public.occasions(id),
    classification TEXT NOT NULL,
    year INTEGER,
    pdf_url TEXT,
    uploader_id UUID REFERENCES public.users(id),
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Insert Initial Occasions
INSERT INTO public.occasions (name) VALUES 
('عاشوراء'), 
('مولد النبي'), 
('وفاة الإمام علي'), 
('ليالي القدر'), 
('عيد الفطر')
ON CONFLICT DO NOTHING;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occasions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;

-- 4. Policies (Public Read Access)
CREATE POLICY "Public read for occasions" ON public.occasions FOR SELECT USING (true);
CREATE POLICY "Public read for poems" ON public.poems FOR SELECT USING (true);
CREATE POLICY "Public read for users" ON public.users FOR SELECT USING (true);
