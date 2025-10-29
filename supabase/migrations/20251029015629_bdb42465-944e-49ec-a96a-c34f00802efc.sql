-- Actualizar la función handle_new_user para manejar correctamente los planes
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  user_plan TEXT;
  max_props INTEGER;
BEGIN
  -- Insertar perfil
  INSERT INTO public.profiles (id, full_name, role, email, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'tenant')::public.user_role,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone_number', '')
  );
  
  -- Si es landlord, crear landlord_details con el plan correcto
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'tenant') = 'landlord' THEN
    user_plan := COALESCE(NEW.raw_user_meta_data->>'subscription_plan', 'basic');
    
    -- Establecer max_properties según el plan
    CASE LOWER(user_plan)
      WHEN 'basic' THEN max_props := 5;
      WHEN 'pro' THEN max_props := 20;
      WHEN 'premium' THEN max_props := 20;
      WHEN 'enterprise' THEN max_props := 999999;
      ELSE max_props := 5;
    END CASE;
    
    INSERT INTO public.landlord_details (
      user_id,
      subscription_plan,
      subscription_status,
      max_properties,
      payment_verified
    ) VALUES (
      NEW.id,
      INITCAP(user_plan), -- Capitalizar el nombre del plan
      'pending',
      max_props,
      false
    );
  END IF;
  
  RETURN NEW;
END;
$function$;