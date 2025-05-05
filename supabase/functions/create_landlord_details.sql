
-- Create RPC function to insert landlord details
CREATE OR REPLACE FUNCTION create_landlord_details(user_id UUID, plan TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.landlord_details (
    id, 
    company_name, 
    subscription_plan,
    subscription_start_date
  ) VALUES (
    user_id,
    '',
    plan,
    now()
  );
END;
$$;

-- Create RPC function to get landlord details
CREATE OR REPLACE FUNCTION get_landlord_details(user_id UUID)
RETURNS public.landlord_details
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT * FROM public.landlord_details
    WHERE id = user_id
    LIMIT 1
  );
END;
$$;
