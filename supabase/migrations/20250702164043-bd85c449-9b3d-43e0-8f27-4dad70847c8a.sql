-- Create trigger to automatically create profiles when users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'tenant')::public.user_role
  );
  
  -- If user is a landlord, create landlord_details record
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'tenant') = 'landlord' THEN
    INSERT INTO public.landlord_details (
      user_id,
      subscription_plan,
      subscription_status
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'subscription_plan', 'basic'),
      'pending'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add missing phone_number column to profiles table  
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;