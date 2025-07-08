
-- Add rent amount to properties table
ALTER TABLE public.properties ADD COLUMN rent_amount DECIMAL(10,2);

-- Create tenant_invitations table
CREATE TABLE public.tenant_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  landlord_id UUID NOT NULL,
  property_id UUID NOT NULL,
  tenant_name TEXT NOT NULL,
  tenant_email TEXT NOT NULL,
  unit_number TEXT NOT NULL,
  rent_amount DECIMAL(10,2) NOT NULL,
  invitation_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- Enable Row Level Security
ALTER TABLE public.tenant_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for tenant_invitations
CREATE POLICY "Landlords can view their own invitations" 
ON public.tenant_invitations FOR SELECT USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can create their own invitations" 
ON public.tenant_invitations FOR INSERT WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update their own invitations" 
ON public.tenant_invitations FOR UPDATE USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete their own invitations" 
ON public.tenant_invitations FOR DELETE USING (auth.uid() = landlord_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tenant_invitations_updated_at
BEFORE UPDATE ON public.tenant_invitations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraints
ALTER TABLE public.tenant_invitations 
ADD CONSTRAINT fk_tenant_invitations_landlord 
FOREIGN KEY (landlord_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.tenant_invitations 
ADD CONSTRAINT fk_tenant_invitations_property 
FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;

-- Create function to generate invitation code
CREATE OR REPLACE FUNCTION generate_invitation_code()
RETURNS TEXT AS $$
BEGIN
  RETURN upper(substring(md5(random()::text) from 1 for 8));
END;
$$ LANGUAGE plpgsql;
