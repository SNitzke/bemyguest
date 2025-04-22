import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Check, Phone, User, Mail, Building2 } from 'lucide-react';
import { SubscriptionPlan } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
      // Using RPC without the .select() method since the RPC function itself returns the data
      const { data, error } = await supabase
        .rpc('get_subscription_plans');
        
      if (error) {
        console.error('Error fetching subscription plans:', error);
        // Fallback to default data if query fails
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
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="fullName"
              placeholder="John Doe"
              className="pl-10"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="pl-10"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="(555) 123-4567"
              className="pl-10"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>I am a</Label>
          <RadioGroup
            value={formData.role}
            onValueChange={(value: 'tenant' | 'landlord') => 
              setFormData(prev => ({ ...prev, role: value }))
            }
            className="grid grid-cols-2 gap-4"
          >
            <Label
              htmlFor="tenant"
              className={`flex cursor-pointer items-center justify-center rounded-lg border p-4 ${
                formData.role === 'tenant' ? 'border-primary bg-primary/10' : 'border-muted'
              }`}
            >
              <RadioGroupItem value="tenant" id="tenant" className="sr-only" />
              <Building2 className="mr-2 h-5 w-5" />
              Tenant
            </Label>

            <Label
              htmlFor="landlord"
              className={`flex cursor-pointer items-center justify-center rounded-lg border p-4 ${
                formData.role === 'landlord' ? 'border-primary bg-primary/10' : 'border-muted'
              }`}
            >
              <RadioGroupItem value="landlord" id="landlord" className="sr-only" />
              <Building2 className="mr-2 h-5 w-5" />
              Landlord
            </Label>
          </RadioGroup>
        </div>

        {formData.role === 'landlord' && plans && (
          <div className="space-y-4">
            <Label>Select your subscription plan</Label>
            <div className="grid gap-4 md:grid-cols-3">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    formData.subscriptionPlan === plan.name 
                      ? 'border-primary ring-2 ring-primary' 
                      : ''
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, subscriptionPlan: plan.name }))}
                >
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      ${(plan.monthly_price / 100).toFixed(2)}/month
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        {plan.features.max_properties === 'unlimited' 
                          ? 'Unlimited properties'
                          : `Up to ${plan.features.max_properties} properties`}
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        {plan.features.support} support
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="button"
                      variant={formData.subscriptionPlan === plan.name ? 'default' : 'outline'}
                      className="w-full"
                    >
                      {formData.subscriptionPlan === plan.name ? 'Selected' : 'Select Plan'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
      </Button>
    </form>
  );
};
