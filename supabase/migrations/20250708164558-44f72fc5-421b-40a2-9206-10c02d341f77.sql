
-- Create manual_payments table for landlords to record payments received outside the platform
CREATE TABLE public.manual_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  property_id UUID,
  amount DECIMAL(10,2) NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('rent', 'utilities', 'maintenance', 'humidity', 'waterproofing', 'plumbing', 'other')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'bank_transfer', 'check', 'other')),
  description TEXT,
  payment_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.manual_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for manual_payments
CREATE POLICY "Landlords can view their own manual payments" 
ON public.manual_payments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Landlords can create their own manual payments" 
ON public.manual_payments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Landlords can update their own manual payments" 
ON public.manual_payments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Landlords can delete their own manual payments" 
ON public.manual_payments FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_manual_payments_updated_at
BEFORE UPDATE ON public.manual_payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraint for property_id (optional relationship)
ALTER TABLE public.manual_payments 
ADD CONSTRAINT fk_manual_payments_property 
FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE SET NULL;
