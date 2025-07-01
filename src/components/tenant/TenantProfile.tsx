
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { User, Settings, Home, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TenantProfile: React.FC = () => {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Panel de Inquilino</h1>
        <p className="text-muted-foreground">
          Bienvenido de vuelta, {profile?.full_name || 'Inquilino'}. Gestiona tu información de alquiler
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Mi Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nombre Completo</p>
              <p className="font-medium">{profile?.full_name || 'No proporcionado'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <p className="font-medium">{profile?.phone_number || 'No proporcionado'}</p>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/settings')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Editar Perfil
            </Button>
          </CardContent>
        </Card>

        {/* Property Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home size={20} />
              Mi Propiedad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tienes una propiedad asignada</p>
              <p className="text-sm text-muted-foreground mt-2">
                Contacta a tu propietario para obtener una invitación
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={20} />
              Pagos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay pagos pendientes</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/payments')}
              >
                Ver Historial de Pagos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantProfile;
