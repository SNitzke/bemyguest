
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PersonalInfoFields } from './signup/PersonalInfoFields';
import { PasswordFields } from './signup/PasswordFields';
import { RoleSelector } from './signup/RoleSelector';
import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { SignupData } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { STRIPE_PLANS, PlanId } from '@/config/stripe';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Check, Building2, Sparkles, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const planIcons: Record<PlanId, React.ReactNode> = {
  basic: <Building2 className="h-6 w-6" />,
  pro: <Sparkles className="h-6 w-6" />,
  premium: <Crown className="h-6 w-6" />,
};

export const EnhancedSignUpForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'tenant' as 'tenant' | 'landlord',
    password: '',
    confirmPassword: '',
    subscriptionPlan: 'basic' as PlanId
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
        return true;
        
      case 4:
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

  const syncStripeCustomer = async (accessToken: string, role: string, fullName: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('sync-stripe-customer', {
        body: { role, fullName },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (error) {
        console.error('Error syncing Stripe customer:', error);
      } else {
        console.log('Stripe customer synced:', data);
      }
    } catch (error) {
      console.error('Error syncing Stripe customer:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      // Sync with Stripe after successful signup
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await syncStripeCustomer(session.access_token, formData.role, formData.fullName);
        
        // If landlord, redirect to checkout
        if (formData.role === 'landlord') {
          const plan = STRIPE_PLANS[formData.subscriptionPlan];
          
          const { data, error } = await supabase.functions.invoke('create-checkout', {
            body: { priceId: plan.price_id, planName: plan.name },
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (error) throw error;
          if (data.error) throw new Error(data.error);
          
          toast.success('¡Cuenta creada! Redirigiendo al pago...');
          window.open(data.url, '_blank');
          navigate('/landlord-profile');
        }
      }
      
    } catch (error) {
      console.error("Error durante el registro:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalSteps = () => {
    return formData.role === 'tenant' ? 3 : 4;
  };

  const isLastStep = step === getTotalSteps();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold">Información Personal</h3>
              <p className="text-muted-foreground mt-2">Completa tus datos básicos para comenzar</p>
            </div>
            <PersonalInfoFields formData={formData} onChange={updateFormData} />
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold">Crear Contraseña</h3>
              <p className="text-muted-foreground mt-2">Elige una contraseña segura para tu cuenta</p>
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
              <h3 className="text-xl font-semibold">Selecciona tu Rol</h3>
              <p className="text-muted-foreground mt-2">¿Eres inquilino o propietario de inmuebles?</p>
            </div>
            <RoleSelector role={formData.role} onChange={updateRole} />
          </div>
        );
        
      case 4:
        if (formData.role === 'landlord') {
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold">Selecciona tu Plan</h3>
                <p className="text-muted-foreground mt-2">Elige el plan que mejor se adapte a tus necesidades</p>
                <Badge variant="outline" className="mt-2">
                  Serás redirigido a Stripe para el pago seguro
                </Badge>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                {(Object.keys(STRIPE_PLANS) as PlanId[]).map((planId) => {
                  const plan = STRIPE_PLANS[planId];
                  const isSelected = formData.subscriptionPlan === planId;
                  const isPopular = planId === 'pro';

                  return (
                    <Card 
                      key={planId}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-lg relative",
                        isSelected && "border-primary ring-2 ring-primary",
                        isPopular && !isSelected && "border-primary/50"
                      )}
                      onClick={() => updateFormData('subscriptionPlan', planId)}
                    >
                      {isPopular && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                          Más Popular
                        </Badge>
                      )}
                      
                      <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          {planIcons[planId]}
                        </div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <CardDescription>
                          <span className="text-2xl font-bold text-foreground">
                            {formatPrice(plan.price)}
                          </span>
                          <span className="text-muted-foreground">/{plan.interval}</span>
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-2">
                        <ul className="space-y-2 text-sm">
                          {plan.features.slice(0, 4).map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      
                      <CardFooter>
                        <Button
                          type="button"
                          className="w-full"
                          variant={isSelected ? "default" : "outline"}
                        >
                          {isSelected ? "Seleccionado" : "Seleccionar"}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
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
          <span className="text-sm font-medium">
            Paso {step} de {getTotalSteps()}
          </span>
          <span className="text-sm font-medium">
            {Math.round((step / getTotalSteps()) * 100)}% completado
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div 
            className="bg-primary h-3 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${(step / getTotalSteps()) * 100}%` }}
          />
        </div>
      </div>

      {/* Form content */}
      <div className="bg-card rounded-lg p-6 shadow-sm border">
        {renderStepContent()}
        
        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
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
            <div />
          )}
          
          {isLastStep ? (
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-2"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Creando cuenta...
                </div>
              ) : formData.role === 'landlord' ? (
                "Crear Cuenta y Pagar"
              ) : (
                "Crear Cuenta"
              )}
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={handleNext}
              className="px-6 py-2"
            >
              Siguiente →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
