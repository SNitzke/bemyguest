import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Home, 
  User, 
  CreditCard, 
  MessageSquare, 
  AlertCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TenantData {
  id: string;
  property_id: string;
  unit_number: string;
  rent_amount: number;
  property: {
    name: string;
    address: string;
  };
  landlord: {
    full_name: string;
    email: string;
  };
}

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const TenantOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [tenantData, setTenantData] = useState<TenantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: '¡Bienvenido a BeMyGuest!',
      description: 'Tu cuenta ha sido creada exitosamente',
      completed: true
    },
    {
      id: 2,
      title: 'Confirma tu propiedad',
      description: 'Verifica que la información de la propiedad sea correcta',
      completed: false
    },
    {
      id: 3,
      title: 'Información del inmueble',
      description: 'Revisa los detalles de tu nueva vivienda',
      completed: false
    },
    {
      id: 4,
      title: 'Completa tu perfil',
      description: 'Agrega tu información personal y método de pago',
      completed: false
    },
    {
      id: 5,
      title: '¡Todo listo!',
      description: 'Accede a todas las funcionalidades de la plataforma',
      completed: false
    }
  ];

  useEffect(() => {
    const fetchTenantData = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('tenants')
          .select(`
            id,
            property_id,
            unit_number,
            rent_amount,
            properties:property_id (
              name,
              address
            ),
            profiles:landlord_id (
              full_name,
              email
            )
          `)
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching tenant data:', error);
        } else if (data) {
          setTenantData({
            id: data.id,
            property_id: data.property_id,
            unit_number: data.unit_number,
            rent_amount: data.rent_amount,
            property: data.properties as any,
            landlord: data.profiles as any
          });
        }
      } catch (error) {
        console.error('Error in fetchTenantData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenantData();
  }, [user]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmProperty = () => {
    toast.success('¡Propiedad confirmada correctamente!');
    handleNext();
  };

  const handleCompleteOnboarding = () => {
    toast.success('¡Onboarding completado! Bienvenido a BeMyGuest');
    navigate('/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">¡Cuenta creada exitosamente!</h2>
              <p className="text-muted-foreground">
                Bienvenido a BeMyGuest, {profile?.full_name}. Te guiaremos paso a paso 
                para configurar tu cuenta y conectarte con tu propiedad.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Confirma tu propiedad</h2>
              <p className="text-muted-foreground mb-6">
                ¿Es esta la vivienda que acordaste con tu propietario?
              </p>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Cargando información...</p>
              </div>
            ) : tenantData ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Detalles de la Propiedad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Propiedad</p>
                      <p className="font-medium">{tenantData.property.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unidad</p>
                      <p className="font-medium">{tenantData.unit_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium">{tenantData.property.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Renta mensual</p>
                      <p className="font-medium">${tenantData.rent_amount}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">Propietario</p>
                    <p className="font-medium">{tenantData.landlord.full_name}</p>
                    <p className="text-sm text-muted-foreground">{tenantData.landlord.email}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No se encontró información de la propiedad
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-10 w-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Tu nueva vivienda</h2>
              <p className="text-muted-foreground mb-6">
                Aquí tienes toda la información importante sobre tu propiedad
              </p>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Información del Inmueble
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tenantData && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Propiedad:</span>
                        <span className="font-medium">{tenantData.property.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dirección:</span>
                        <span className="font-medium">{tenantData.property.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Unidad:</span>
                        <span className="font-medium">{tenantData.unit_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Renta:</span>
                        <Badge variant="secondary">${tenantData.rent_amount}/mes</Badge>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Tu Propietario
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tenantData && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nombre:</span>
                        <span className="font-medium">{tenantData.landlord.full_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{tenantData.landlord.email}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Completa tu perfil</h2>
              <p className="text-muted-foreground mb-6">
                Agrega tu información personal y configura tu método de pago
              </p>
            </div>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/settings')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Actualizar información personal
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Método de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/settings')}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Configurar método de pago
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">¡Todo está listo!</h2>
              <p className="text-muted-foreground mb-6">
                Tu cuenta está completamente configurada. Ahora puedes acceder a todas las funcionalidades:
              </p>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <AlertCircle className="h-5 w-5 text-primary" />
                <span>Reportar problemas y hacer solicitudes</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>Comunicarte directamente con tu propietario</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <CreditCard className="h-5 w-5 text-primary" />
                <span>Ver el estado de tus pagos</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <User className="h-5 w-5 text-primary" />
                <span>Gestionar tu perfil e información</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-12 h-0.5 mx-2
                    ${currentStep > step.id ? 'bg-primary' : 'bg-muted'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="font-medium">{steps[currentStep - 1]?.title}</h3>
            <p className="text-sm text-muted-foreground">{steps[currentStep - 1]?.description}</p>
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>

          {currentStep === 2 && tenantData ? (
            <Button onClick={handleConfirmProperty}>
              Confirmar Propiedad
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : currentStep === steps.length ? (
            <Button onClick={handleCompleteOnboarding}>
              Ir al Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={currentStep === steps.length}
            >
              Siguiente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantOnboarding;