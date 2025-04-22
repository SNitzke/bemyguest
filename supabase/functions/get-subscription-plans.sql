
-- This SQL function will fetch subscription plans from our database
CREATE OR REPLACE FUNCTION public.get_subscription_plans()
RETURNS SETOF jsonb
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT jsonb_build_object(
    'id', id,
    'name', name,
    'description', description,
    'monthly_price', monthly_price,
    'features', features
  )
  FROM public.subscription_plans
  ORDER BY monthly_price;
$$;
