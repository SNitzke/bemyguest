import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const paymentTypeOptions = [
  { value: 'rent', label: 'Pago de Renta' },
  { value: 'utilities', label: 'Pago de Servicios' },
  { value: 'maintenance', label: 'Mantenimiento General' },
  { value: 'humidity', label: 'Tratamiento de Humedad' },
  { value: 'waterproofing', label: 'Impermeabilización' },
  { value: 'plumbing', label: 'Tuberías' },
  { value: 'other', label: 'Otro' }
];

const paymentMethodOptions = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'bank_transfer', label: 'Transferencia Bancaria' },
  { value: 'check', label: 'Cheque' },
  { value: 'other', label: 'Otro' }
];

const manualPaymentSchema = z.object({
  property_id: z.string().optional(),
  amount: z.string().min(1, 'El monto es requerido'),
  payment_type: z.string().min(1, 'Selecciona el tipo de pago'),
  payment_method: z.string().min(1, 'Selecciona el método de pago'),
  description: z.string().optional(),
  payment_date: z.string().min(1, 'La fecha es requerida')
});

type ManualPaymentForm = z.infer<typeof manualPaymentSchema>;

interface ManualPaymentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface Property {
  id: string;
  name: string;
  address: string;
}

export function ManualPaymentForm({ open, onOpenChange, onSuccess }: ManualPaymentFormProps) {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ManualPaymentForm>({
    resolver: zodResolver(manualPaymentSchema),
    defaultValues: {
      property_id: '',
      amount: '',
      payment_type: '',
      payment_method: '',
      description: '',
      payment_date: new Date().toISOString().split('T')[0]
    }
  });

  useEffect(() => {
    if (open && user) {
      fetchProperties();
    }
  }, [open, user]);

  const fetchProperties = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, name, address')
        .eq('user_id', user.id);

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Error al cargar las propiedades');
    }
  };

  const onSubmit = async (data: ManualPaymentForm) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('manual_payments')
        .insert({
          user_id: user.id,
          property_id: data.property_id || null,
          amount: parseFloat(data.amount),
          payment_type: data.payment_type,
          payment_method: data.payment_method,
          description: data.description,
          payment_date: data.payment_date
        });

      if (error) throw error;

      toast.success('Pago registrado exitosamente');
      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating manual payment:', error);
      toast.error('Error al registrar el pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Pago Manual</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="property_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Propiedad (Opcional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una propiedad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Sin asociar a propiedad</SelectItem>
                      {properties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.name} - {property.address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Pago *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="payment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Pago *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de pago" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pago *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el método de pago" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethodOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalles adicionales del pago..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Registrando...' : 'Registrar Pago'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}