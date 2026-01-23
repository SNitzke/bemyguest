import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Crown, 
  CreditCard, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const SubscriptionStatus: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { 
    subscribed, 
    planName, 
    subscriptionEnd, 
    maxProperties,
    isLoading,
    openCustomerPortal,
    checkSubscription
  } = useSubscription();

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al abrir portal');
    }
  };

  const handleRefresh = async () => {
    toast.promise(checkSubscription(), {
      loading: 'Verificando suscripción...',
      success: 'Estado actualizado',
      error: 'Error al verificar',
    });
  };

  if (profile?.role !== 'landlord') {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-muted-foreground">Cargando estado de suscripción...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscribed) {
    return (
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-lg">Sin Suscripción Activa</CardTitle>
          </div>
          <CardDescription>
            Activa tu suscripción para desbloquear todas las funciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Para gestionar tus propiedades y acceder a todas las funcionalidades,
            necesitas una suscripción activa.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/pricing')} className="gap-2">
              <CreditCard className="h-4 w-4" />
              Ver Planes
            </Button>
            <Button variant="outline" onClick={handleRefresh}>
              Actualizar Estado
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Tu Suscripción</CardTitle>
          </div>
          <Badge variant="default" className="bg-primary">
            {planName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Estado</p>
              <p className="text-sm text-muted-foreground">Activa</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">Propiedades</p>
              <p className="text-sm text-muted-foreground">
                Hasta {maxProperties === 999999 ? 'ilimitadas' : maxProperties}
              </p>
            </div>
          </div>
          
          {subscriptionEnd && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Próxima facturación</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(subscriptionEnd), "d 'de' MMMM, yyyy", { locale: es })}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={handleManageSubscription} className="gap-2">
            <Settings className="h-4 w-4" />
            Gestionar Suscripción
          </Button>
          <Button variant="ghost" onClick={handleRefresh}>
            Actualizar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
