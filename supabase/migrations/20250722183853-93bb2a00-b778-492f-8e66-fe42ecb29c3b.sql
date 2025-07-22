-- Update the handle_new_user function to include email field
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, email, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'tenant')::public.user_role,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone_number', '')
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