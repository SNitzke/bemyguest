ALTER TABLE public.issues ADD COLUMN receipt_path text;
ALTER TABLE public.issues ADD COLUMN payment_note text;
CREATE POLICY "Tenants upload own receipts" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'receipts' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Parties read receipts" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'receipts' AND (
  (storage.foldername(name))[1] = auth.uid()::text
  OR EXISTS (SELECT 1 FROM public.issues i WHERE i.receipt_path = storage.objects.name AND i.landlord_id = auth.uid())
));