
-- Create a function to retrieve subscription plans
CREATE OR REPLACE FUNCTION public.get_subscription_plans()
RETURNS TABLE(
  id UUID,
  name TEXT,
  description TEXT,
  monthly_price INTEGER,
  features JSONB
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    id,
    name,
    description,
    monthly_price,
    features
  FROM public.subscription_plans
  ORDER BY monthly_price;
$$;
