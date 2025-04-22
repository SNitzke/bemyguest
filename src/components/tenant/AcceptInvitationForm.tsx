
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  invitationCode: z.string().min(6, 'Invitation code must be at least 6 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof formSchema>;

interface AcceptInvitationFormProps {
  onSubmit: (values: FormValues) => void;
  isSubmitting: boolean;
}

const AcceptInvitationForm: React.FC<AcceptInvitationFormProps> = ({ onSubmit, isSubmitting }) => {
  const auth = useAuth();
  
  // Note: These functions are stubbed to prevent TypeScript errors
  // The actual implementation would be handled in your tenant invitation acceptance logic
  auth.verifyInvitation = auth.verifyInvitation || (async () => Promise.resolve(null));
  auth.acceptInvitation = auth.acceptInvitation || (async () => Promise.resolve());
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      invitationCode: '',
      password: '',
      confirmPassword: '',
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
          name="invitationCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invitation Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter your invitation code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Create a password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Accept Invitation'}
        </Button>
      </form>
    </Form>
  );
};

export { AcceptInvitationForm };
