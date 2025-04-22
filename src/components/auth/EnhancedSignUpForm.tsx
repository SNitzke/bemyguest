import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { SubscriptionPlan } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PersonalInfoFields } from './signup/PersonalInfoFields';
import { RoleSelector } from './signup/RoleSelector';
import { SubscriptionPlans } from './signup/SubscriptionPlans';
import { PasswordFields } from './signup/PasswordFields';

export const EnhancedSignUpForm = () => {
  const { signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    role: 'tenant' as 'tenant' | 'landlord',
    subscriptionPlan: 'Basic'
  });

  // Fetch subscription plans from Supabase
  const { data: plans } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-subscription-plans');
      
      if (error) {
        console.error('Error fetching subscription plans:', error);
        return [
          {
            id: '1',
            name: 'Basic',
            description: 'Perfect for small landlords',
            monthly_price: 999,
            features: { max_properties: 3, support: 'email' }
          },
          {
            id: '2', 
            name: 'Professional',
            description: 'Great for growing property management',
            monthly_price: 2999,
            features: { max_properties: 15, support: 'priority' }
          },
          {
            id: '3',
            name: 'Enterprise',
            description: 'Complete solution for large portfolios',
            monthly_price: 4999,
            features: { max_properties: 'unlimited', support: 'dedicated' }
          }
        ] as SubscriptionPlan[];
      }
      
      return data as SubscriptionPlan[];
    }
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match");
      }

      await signup({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
        subscriptionPlan: formData.role === 'landlord' ? formData.subscriptionPlan : undefined,
        phoneNumber: formData.phoneNumber
      });

      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PersonalInfoFields 
        formData={formData} 
        onChange={handleFieldChange} 
      />

      <RoleSelector 
        role={formData.role} 
        onChange={(role) => handleFieldChange('role', role)} 
      />

      {formData.role === 'landlord' && plans && (
        <SubscriptionPlans
          plans={plans}
          selectedPlan={formData.subscriptionPlan}
          onSelectPlan={(plan) => handleFieldChange('subscriptionPlan', plan)}
        />
      )}

      <PasswordFields
        password={formData.password}
        confirmPassword={formData.confirmPassword}
        onChange={handleFieldChange}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
      </Button>
    </form>
  );
};
