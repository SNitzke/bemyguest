
-- Migration: Create profiles and landlord_details tables with proper relationships

-- Create profiles table for all users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  role TEXT NOT NULL CHECK (role IN ('tenant', 'landlord')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create landlord_details table for landlord-specific information
CREATE TABLE IF NOT EXISTS public.landlord_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  business_name TEXT,
  address TEXT,
  subscription_plan TEXT NOT NULL DEFAULT 'Basic',
  subscription_status TEXT NOT NULL DEFAULT 'pending' CHECK (subscription_status IN ('pending', 'active', 'inactive', 'cancelled')),
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,
  payment_verified BOOLEAN NOT NULL DEFAULT false,
  properties_count INTEGER NOT NULL DEFAULT 0,
  max_properties INTEGER NOT NULL DEFAULT 5,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landlord_details ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- RLS Policies for landlord_details
CREATE POLICY "Landlords can view own details" ON public.landlord_details
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Landlords can update own details" ON public.landlord_details
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Insert landlord details" ON public.landlord_details
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone_number, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'tenant')
  );
  
  -- If user is a landlord, create landlord_details record
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'tenant') = 'landlord' THEN
    INSERT INTO public.landlord_details (
      user_id,
      subscription_plan,
      subscription_status
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'subscription_plan', 'Basic'),
      'pending'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get landlord details
CREATE OR REPLACE FUNCTION public.get_landlord_details(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'id', ld.id,
    'user_id', ld.user_id,
    'company_name', ld.company_name,
    'business_name', ld.business_name,
    'address', ld.address,
    'subscription_plan', ld.subscription_plan,
    'subscription_status', ld.subscription_status,
    'subscription_start_date', ld.subscription_start_date,
    'subscription_end_date', ld.subscription_end_date,
    'payment_verified', ld.payment_verified,
    'properties_count', ld.properties_count,
    'max_properties', ld.max_properties,
    'verified', ld.verified,
    'created_at', ld.created_at
  ) INTO result
  FROM landlord_details ld
  WHERE ld.user_id = get_landlord_details.user_id;
  
  RETURN result;
END;
$$;

-- Function to create/update landlord details
CREATE OR REPLACE FUNCTION public.create_landlord_details(
  user_id UUID,
  plan TEXT DEFAULT 'Basic'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  max_props INTEGER := 5;
  result JSON;
BEGIN
  -- Set max properties based on plan
  CASE plan
    WHEN 'Premium' THEN max_props := 20;
    WHEN 'Enterprise' THEN max_props := 999999;
    ELSE max_props := 5;
  END CASE;
  
  INSERT INTO landlord_details (
    user_id,
    subscription_plan,
    max_properties,
    subscription_status
  ) VALUES (
    create_landlord_details.user_id,
    plan,
    max_props,
    'pending'
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    subscription_plan = plan,
    max_properties = max_props,
    updated_at = now();
  
  -- Return the created/updated record
  SELECT json_build_object(
    'success', true,
    'user_id', create_landlord_details.user_id,
    'plan', plan,
    'max_properties', max_props
  ) INTO result;
  
  RETURN result;
END;
$$;
