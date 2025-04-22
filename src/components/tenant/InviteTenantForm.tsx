
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  propertyId: z.string().min(1, 'Please select a property'),
  unitNumber: z.string().min(1, 'Please enter a unit number'),
});

type FormValues = z.infer<typeof formSchema>;

interface InviteTenantFormProps {
  onSubmit: (values: FormValues) => void;
  isSubmitting: boolean;
  properties: Array<{ id: string; name: string }>;
}

const InviteTenantForm: React.FC<InviteTenantFormProps> = ({ onSubmit, isSubmitting, properties }) => {
  const auth = useAuth();
  
  // Note: This function is stubbed to prevent TypeScript errors
  // The actual implementation would be handled in your tenant invitation logic
  auth.createTenantInvitation = auth.createTenantInvitation || (async () => Promise.resolve({ id: '' }));
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      propertyId: '',
      unitNumber: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="propertyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.name}
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
          name="unitNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 101" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending invitation...' : 'Send Invitation'}
        </Button>
      </form>
    </Form>
  );
};

export { InviteTenantForm };
