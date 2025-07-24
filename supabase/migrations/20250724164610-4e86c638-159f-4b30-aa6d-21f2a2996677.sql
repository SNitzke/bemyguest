-- Create tenants table to associate tenants with properties
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  landlord_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  move_in_date DATE,
  lease_end_date DATE,
  rent_amount DECIMAL(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(property_id, unit_number)
);

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Create policies for tenants table
CREATE POLICY "Landlords can view their property tenants"
  ON public.tenants
  FOR SELECT
  USING (auth.uid() = landlord_id);

CREATE POLICY "Tenants can view their own record"
  ON public.tenants
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Landlords can insert tenants for their properties"
  ON public.tenants
  FOR INSERT
  WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update their property tenants"
  ON public.tenants
  FOR UPDATE
  USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete their property tenants"
  ON public.tenants
  FOR DELETE
  USING (auth.uid() = landlord_id);

-- Add trigger for updated_at
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create issues table for property maintenance requests
CREATE TABLE public.issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
  landlord_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  images TEXT[], -- Array of image URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for issues
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- Create policies for issues
CREATE POLICY "Landlords can view issues for their properties"
  ON public.issues
  FOR SELECT
  USING (auth.uid() = landlord_id);

CREATE POLICY "Tenants can view their own issues"
  ON public.issues
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tenants 
      WHERE tenants.id = issues.tenant_id 
      AND tenants.user_id = auth.uid()
    )
  );

CREATE POLICY "Landlords can create issues for their properties"
  ON public.issues
  FOR INSERT
  WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Tenants can create issues for their properties"
  ON public.issues
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tenants 
      WHERE tenants.id = issues.tenant_id 
      AND tenants.user_id = auth.uid()
    )
  );

CREATE POLICY "Landlords can update issues for their properties"
  ON public.issues
  FOR UPDATE
  USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete issues for their properties"
  ON public.issues
  FOR DELETE
  USING (auth.uid() = landlord_id);

-- Add trigger for issues updated_at
CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON public.issues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create payments table for rent and other payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  landlord_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_type TEXT DEFAULT 'rent' CHECK (payment_type IN ('rent', 'deposit', 'utilities', 'late_fee', 'other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  due_date DATE NOT NULL,
  payment_date DATE,
  payment_method TEXT CHECK (payment_method IN ('cash', 'check', 'bank_transfer', 'credit_card', 'online')),
  description TEXT,
  reference_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Landlords can view payments for their properties"
  ON public.payments
  FOR SELECT
  USING (auth.uid() = landlord_id);

CREATE POLICY "Tenants can view their own payments"
  ON public.payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tenants 
      WHERE tenants.id = payments.tenant_id 
      AND tenants.user_id = auth.uid()
    )
  );

CREATE POLICY "Landlords can create payments for their properties"
  ON public.payments
  FOR INSERT
  WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update payments for their properties"
  ON public.payments
  FOR UPDATE
  USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete payments for their properties"
  ON public.payments
  FOR DELETE
  USING (auth.uid() = landlord_id);

-- Add trigger for payments updated_at
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();