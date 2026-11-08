ALTER TABLE public.issues ADD COLUMN tenant_paid_amount numeric;
ALTER TABLE public.issues ADD COLUMN reimbursement_mode text;
ALTER TABLE public.issues ADD COLUMN reimbursement_months integer;