CREATE TABLE public.maintenance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'maintenance',
  repaired_on date NOT NULL DEFAULT CURRENT_DATE,
  next_due_on date,
  cost numeric,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.maintenance_records TO authenticated;
GRANT ALL ON public.maintenance_records TO service_role;
ALTER TABLE public.maintenance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Landlords read maintenance" ON public.maintenance_records FOR SELECT TO authenticated USING (landlord_id = auth.uid());
CREATE POLICY "Landlords add maintenance" ON public.maintenance_records FOR INSERT TO authenticated WITH CHECK (landlord_id = auth.uid() AND EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.landlord_id = auth.uid()));
CREATE POLICY "Landlords edit maintenance" ON public.maintenance_records FOR UPDATE TO authenticated USING (landlord_id = auth.uid()) WITH CHECK (landlord_id = auth.uid());
CREATE POLICY "Landlords delete maintenance" ON public.maintenance_records FOR DELETE TO authenticated USING (landlord_id = auth.uid());
CREATE INDEX ON public.maintenance_records (landlord_id, next_due_on);