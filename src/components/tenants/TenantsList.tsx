import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Mail, Phone, Calendar, DollarSign, MapPin } from 'lucide-react';
import { useTenants, Tenant } from '@/hooks/useTenants';

interface TenantsListProps {
  propertyId?: string;
  showAll?: boolean;
}

const TenantsList: React.FC<TenantsListProps> = ({ propertyId, showAll = false }) => {
  const { tenants, isLoading, error } = useTenants();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <Card>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error al cargar inquilinos: {error}
      </div>
    );
  }

  const filteredTenants = propertyId 
    ? tenants.filter(tenant => tenant.property_id === propertyId)
    : tenants;

  if (filteredTenants.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {propertyId ? 'No hay inquilinos en esta propiedad' : 'No tienes inquilinos registrados'}
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      {filteredTenants.map((tenant) => (
        <Card key={tenant.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Unidad {tenant.unit_number}
              </CardTitle>
              <Badge className={getStatusColor(tenant.status)}>
                {getStatusText(tenant.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {tenant.rent_amount && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium">
                  ${tenant.rent_amount.toLocaleString()}/mes
                </span>
              </div>
            )}
            
            {tenant.move_in_date && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Entrada: {new Date(tenant.move_in_date).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {tenant.lease_end_date && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Vencimiento: {new Date(tenant.lease_end_date).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {tenant.user_id && (
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-1" />
                  Contactar
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-1" />
                  Llamar
                </Button>
              </div>
            )}
            
            {!tenant.user_id && (
              <div className="text-sm text-muted-foreground">
                Este inquilino aún no ha aceptado la invitación
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {!showAll && filteredTenants.length > 3 && (
        <div className="text-center">
          <Button variant="outline">
            Ver todos los inquilinos ({filteredTenants.length})
          </Button>
        </div>
      )}
    </div>
  );
};

export default TenantsList;