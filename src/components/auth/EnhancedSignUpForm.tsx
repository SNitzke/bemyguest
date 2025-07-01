
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

const plans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfecto para propietarios pequeños',
    monthly_price: 1999,
    features: {
      max_properties: 5,
      support: 'email'
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Ideal para gestión de propiedades en crecimiento',
    monthly_price: 4999,
    features: {
      max_properties: 20,
      support: 'priority'
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Solución completa para grandes carteras',
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
    subscriptionPlan: 'basic'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateRole = (role: 'tenant' | 'landlord') => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.fullName.trim()) {
          toast.error("Por favor ingresa tu nombre completo");
          return false;
        }
        if (!formData.email.trim()) {
          toast.error("Por favor ingresa tu email");
          return false;
        }
        if (!formData.email.includes('@')) {
          toast.error("Por favor ingresa un email válido");
          return false;
        }
        if (!formData.phoneNumber.trim()) {
          toast.error("Por favor ingresa tu número de teléfono");
          return false;
        }
        return true;
        
      case 2:
        if (!formData.password) {
          toast.error("Por favor ingresa una contraseña");
          return false;
        }
        if (formData.password.length < 6) {
          toast.error("La contraseña debe tener al menos 6 caracteres");
          return false;
        }
        if (!formData.confirmPassword) {
          toast.error("Por favor confirma tu contraseña");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error("Las contraseñas no coinciden");
          return false;
        }
        return true;
        
      case 3:
        // Role selection is always valid since we have a default
        return true;
        
      case 4:
        // Subscription plan selection is always valid for landlords
        return true;
        
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps before submitting
    for (let i = 1; i <= (formData.role === 'tenant' ? 3 : 4); i++) {
      if (!validateStep(i)) {
        setStep(i);
        return;
      }
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      const signupData: SignupData = {
        email: formData.email.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        role: formData.role,
        phoneNumber: formData.phoneNumber.trim(),
        ...(formData.role === 'landlord' && { subscriptionPlan: formData.subscriptionPlan })
      };
      
      console.log("Enviando datos de registro:", signupData);
      await signup(signupData);
      
    } catch (error) {
      console.error("Error durante el registro:", error);
      toast.error("Error durante el registro. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalSteps = () => {
    return formData.role === 'tenant' ? 3 : 4;
  };

  const isLastStep = step === getTotalSteps();

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Información Personal</h3>
              <p className="text-gray-600 mt-2">Completa tus datos básicos para comenzar</p>
            </div>
            <PersonalInfoFields formData={formData} onChange={updateFormData} />
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Crear Contraseña</h3>
              <p className="text-gray-600 mt-2">Elige una contraseña segura para tu cuenta</p>
            </div>
            <PasswordFields 
              password={formData.password} 
              confirmPassword={formData.confirmPassword} 
              onChange={updateFormData} 
            />
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Selecciona tu Rol</h3>
              <p className="text-gray-600 mt-2">¿Eres inquilino o propietario de inmuebles?</p>
            </div>
            <RoleSelector role={formData.role} onChange={updateRole} />
          </div>
        );
        
      case 4:
        if (formData.role === 'landlord') {
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Selecciona tu Plan</h3>
                <p className="text-gray-600 mt-2">Elige el plan que mejor se adapte a tus necesidades</p>
                <p className="text-sm text-amber-600 mt-2">
                  Después del registro podrás activar tu plan mediante transferencia bancaria
                </p>
              </div>
              <SubscriptionPlans 
                plans={plans} 
                selectedPlan={formData.subscriptionPlan} 
                onSelectPlan={(plan) => updateFormData('subscriptionPlan', plan)} 
              />
            </div>
          );
        }
        return null;
        
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            Paso {step} de {getTotalSteps()}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {Math.round((step / getTotalSteps()) * 100)}% completado
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-bmg-500 h-3 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${(step / getTotalSteps()) * 100}%` }}
          />
        </div>
      </div>

      {/* Form content */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        {renderStepContent()}
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          {step > 1 ? (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-6 py-2"
            >
              ← Atrás
            </Button>
          ) : (
            <div /> // Empty div to maintain flex layout
          )}
          
          {isLastStep ? (
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2 bg-bmg-500 hover:bg-bmg-600 text-white font-medium"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creando cuenta...
                </div>
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={handleNext}
              className="px-6 py-2 bg-bmg-500 hover:bg-bmg-600 text-white font-medium"
            >
              Siguiente →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
