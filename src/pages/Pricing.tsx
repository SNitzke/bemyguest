import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PricingCards } from '@/components/subscription/PricingCards';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile, isLoading } = useAuth();
  
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  useEffect(() => {
    if (success === 'true') {
      toast.success('¡Suscripción activada exitosamente!');
    }
    if (canceled === 'true') {
      toast.info('Proceso de pago cancelado');
    }
  }, [success, canceled]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Planes para Propietarios
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Elige el plan que mejor se adapte a tus necesidades. 
              Todos los planes incluyen acceso completo a la plataforma.
            </p>
          </div>

          {success === 'true' && (
            <Alert className="mb-8 border-primary bg-primary/10">
              <CheckCircle className="h-4 w-4 text-primary" />
              <AlertTitle>¡Pago exitoso!</AlertTitle>
              <AlertDescription>
                Tu suscripción ha sido activada. Ya puedes disfrutar de todas las funciones.
              </AlertDescription>
            </Alert>
          )}

          {canceled === 'true' && (
            <Alert className="mb-8 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
              <XCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle>Proceso cancelado</AlertTitle>
              <AlertDescription>
                El proceso de pago fue cancelado. Puedes intentarlo de nuevo cuando lo desees.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <PricingCards />

        {!user && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              ¿Aún no tienes cuenta?
            </p>
            <Button onClick={() => navigate('/signup')}>
              Crear cuenta gratis
            </Button>
          </div>
        )}

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">¿Tienes preguntas?</h2>
          <p className="text-muted-foreground mb-4">
            Estamos aquí para ayudarte. Contáctanos en cualquier momento.
          </p>
          <Button variant="outline">
            Contactar Soporte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
