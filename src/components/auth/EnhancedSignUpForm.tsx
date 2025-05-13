
import React, { useState } from 'react';
import { PersonalInfoFields } from './signup/PersonalInfoFields';
import { PasswordFields } from './signup/PasswordFields';
import { RoleSelector } from './signup/RoleSelector';
import { SubscriptionPlans } from './signup/SubscriptionPlans';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { SignupData } from '@/types/auth';
import { SubscriptionPlan } from '@/types';

// Plan data hardcoded for demo (normally these would be fetched from the server)
const plans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Basic',
    description: 'Perfect for small landlords',
    monthly_price: 1999,
    features: {
      max_properties: 5,
      support: 'email'
    }
  },
  {
    id: '2',
    name: 'Pro',
    description: 'Great for growing property management',
    monthly_price: 4999,
    features: {
      max_properties: 20,
      support: 'priority'
    }
  },
  {
    id: '3',
    name: 'Enterprise',
    description: 'Complete solution for large portfolios',
    monthly_price: 9999,
    features: {
      max_properties: 'unlimited',
      support: '24/7'
    }
  }
];

export const EnhancedSignUpForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'tenant' as 'tenant' | 'landlord',
    password: '',
    confirmPassword: '',
    subscriptionPlan: 'Basic'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();

  const updateFormData = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const updateRole = (role: 'tenant' | 'landlord') => {
    setFormData({
      ...formData,
      role
    });
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate personal data
      if (!formData.fullName || !formData.email || !formData.phoneNumber) {
        toast.error("Please complete all fields");
        return;
      }
      if (!formData.email.includes('@')) {
        toast.error("Please enter a valid email");
        return;
      }
    } else if (step === 2) {
      // Validate passwords
      if (!formData.password || formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const signupData: SignupData = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
        phoneNumber: formData.phoneNumber,
        ...(formData.role === 'landlord' && { subscriptionPlan: formData.subscriptionPlan })
      };
      
      await signup(signupData);
      toast.success("Account created successfully. Please verify your email.");
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <PersonalInfoFields formData={formData} onChange={updateFormData} />;
      case 2:
        return <PasswordFields password={formData.password} confirmPassword={formData.confirmPassword} onChange={updateFormData} />;
      case 3:
        return <RoleSelector role={formData.role} onChange={updateRole} />;
      case 4:
        if (formData.role === 'landlord') {
          return (
            <SubscriptionPlans 
              plans={plans} 
              selectedPlan={formData.subscriptionPlan} 
              onSelectPlan={(plan) => updateFormData('subscriptionPlan', plan)} 
            />
          );
        }
        return null;
      default:
        return null;
    }
  };

  const isLastStep = formData.role === 'tenant' ? step === 3 : step === 4;

  return (
    <form onSubmit={isLastStep ? handleSubmit : (e) => e.preventDefault()}>
      {renderStepContent()}
      
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Back
          </Button>
        )}
        
        {isLastStep ? (
          <Button 
            type="submit" 
            className="ml-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        ) : (
          <Button 
            type="button" 
            className="ml-auto"
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </div>
    </form>
  );
};
