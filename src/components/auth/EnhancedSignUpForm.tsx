
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
      if (!formData.fullName || !formData.email || !formData.phoneNumber) {
        toast.error("Por favor completa todos los campos");
        return;
      }
      if (!formData.email.includes('@')) {
        toast.error("Por favor ingresa un email válido");
        return;
      }
    } else if (step === 2) {
      if (!formData.password || formData.password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Las contraseñas no coinciden");
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
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phoneNumber) {
      toast.error("Por favor completa todos los campos obligatorios");
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
      
      console.log("Datos de registro:", signupData);
      await signup(signupData);
      
      toast.success("¡Cuenta creada exitosamente!");
    } catch (error) {
      console.error("Error durante el registro:", error);
      toast.error("Error durante el registro. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Información Personal</h3>
              <p className="text-muted-foreground">Completa tus datos básicos</p>
            </div>
            <PersonalInfoFields formData={formData} onChange={updateFormData} />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Crear Contraseña</h3>
              <p className="text-muted-foreground">Elige una contraseña segura</p>
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
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Selecciona tu Rol</h3>
              <p className="text-muted-foreground">¿Eres inquilino o propietario?</p>
            </div>
            <RoleSelector role={formData.role} onChange={updateRole} />
          </div>
        );
      case 4:
        if (formData.role === 'landlord') {
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Selecciona tu Plan</h3>
                <p className="text-muted-foreground">Después del registro necesitarás realizar una transferencia bancaria para activar tu plan</p>
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

  const isLastStep = formData.role === 'tenant' ? step === 3 : step === 4;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Paso {step} de {formData.role === 'tenant' ? 3 : 4}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round((step / (formData.role === 'tenant' ? 3 : 4)) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(step / (formData.role === 'tenant' ? 3 : 4)) * 100}%` }}
          ></div>
        </div>
      </div>

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
              Atrás
            </Button>
          )}
          
          {isLastStep ? (
            <Button 
              type="submit" 
              className="ml-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>
          ) : (
            <Button 
              type="button" 
              className="ml-auto"
              onClick={handleNext}
            >
              Siguiente
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
