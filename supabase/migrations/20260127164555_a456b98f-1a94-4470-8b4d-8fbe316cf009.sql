-- Fix 1: Add search_path to generate_invitation_code function
CREATE OR REPLACE FUNCTION public.generate_invitation_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN upper(substring(md5(random()::text) from 1 for 8));
END;
$$;

-- Fix 2: Add UPDATE policy for messages (receivers can mark as read)
CREATE POLICY "Receivers can mark messages as read"
ON public.messages
FOR UPDATE
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);

-- Fix 3: Add DELETE policy for landlord_details
CREATE POLICY "Landlords can delete own details"
ON public.landlord_details
FOR DELETE
USING (auth.uid() = user_id);

-- Fix 4: Add DELETE policy for profiles
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);

-- Fix 5: Add DELETE policy for messages
CREATE POLICY "Users can delete their messages"
ON public.messages
FOR DELETE
USING ((auth.uid() = sender_id) OR (auth.uid() = receiver_id));

-- Fix 6: Add policy for tenant_invitations to allow tenants to view their own invitations by email
-- This ensures only the landlord OR the invited tenant can see the invitation
CREATE POLICY "Tenants can view their own invitations"
ON public.tenant_invitations
FOR SELECT
USING (
  tenant_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);