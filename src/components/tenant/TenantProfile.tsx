import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { User, Home, CreditCard, Settings, MessageSquare, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  };
}

const TenantProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [tenantData, setTenantData] = useState<TenantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
              full_name
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">
          Bienvenido, {profile?.full_name || 'Inquilino'}
        </h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y reporta problemas desde tu dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Mi Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nombre completo</p>
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

        {/* Property Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Mi Propiedad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">Cargando información...</p>
              </div>
            ) : tenantData ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Propiedad</p>
                  <p className="font-medium">{tenantData.property.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p className="font-medium">{tenantData.property.address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unidad</p>
                  <p className="font-medium">{tenantData.unit_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Renta mensual</p>
                  <p className="font-medium">${tenantData.rent_amount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Propietario</p>
                  <p className="font-medium">{tenantData.landlord.full_name}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No tienes una propiedad asignada
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Espera a que tu propietario te envíe una invitación
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/report-issue')}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Reportar Problema
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/messages')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Enviar Mensaje
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/payments')}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Ver Pagos
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Importante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">¿Cómo empezar?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Completa tu información personal en Configuración</li>
                <li>• Espera la invitación de tu propietario</li>
                <li>• Reporta cualquier problema que tengas</li>
                <li>• Mantente en contacto mediante mensajes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Funcionalidades disponibles</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Reportar problemas con fotos</li>
                <li>• Comunicación directa con tu propietario</li>
                <li>• Seguimiento de pagos y estado de cuenta</li>
                <li>• Gestión de tu información personal</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantProfile;