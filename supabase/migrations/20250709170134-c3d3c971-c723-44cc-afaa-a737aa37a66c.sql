-- Step 1: Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Add triggers for tables that need automatic updated_at updates
CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tenant_invitations_updated_at
    BEFORE UPDATE ON public.tenant_invitations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_manual_payments_updated_at
    BEFORE UPDATE ON public.manual_payments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();