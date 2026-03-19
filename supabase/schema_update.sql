-- 1. Ensure required extensions are available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Update the handle_new_user function with fixed search_path and robust typing
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  is_first_user BOOLEAN;
BEGIN
  -- Check if this is the first user in the system
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles) INTO is_first_user;

  -- Insert profile
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'مستخدم جديد'), 
    new.email
  );
  
  -- Insert user role with explicit schema and casting
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    new.id, 
    CASE WHEN is_first_user THEN 'admin'::public.user_role_type ELSE 'user'::public.user_role_type END
  );
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Basic logging to Postgres (optional, but good for debugging)
    RAISE NOTICE 'Error in handle_new_user for user %: %', new.id, SQLERRM;
    RETURN new; -- We still return new so as not to block auth creation if profile fails? 
    -- Actually, standard practice is to let it fail so the transaction rolls back, 
    -- but here we want the error captured. If we want it to fail, we'd RAISE EXCEPTION.
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- 3. Re-enable triggers if they were deleted (insurance)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
