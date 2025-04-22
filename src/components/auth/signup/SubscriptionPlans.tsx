
import React from 'react';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Check } from 'lucide-react';
import { SubscriptionPlan } from '@/types';

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  selectedPlan: string;
  onSelectPlan: (planName: string) => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ 
  plans, 
  selectedPlan, 
  onSelectPlan 
}) => {
  return (
    <div className="space-y-4">
      <Label>Select your subscription plan</Label>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`cursor-pointer transition-all ${
              selectedPlan === plan.name 
                ? 'border-primary ring-2 ring-primary' 
                : ''
            }`}
            onClick={() => onSelectPlan(plan.name)}
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
                variant={selectedPlan === plan.name ? 'default' : 'outline'}
                className="w-full"
              >
                {selectedPlan === plan.name ? 'Selected' : 'Select Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
