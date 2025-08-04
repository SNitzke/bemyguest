import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Users } from 'lucide-react';
import TenantsList from '@/components/tenants/TenantsList';
import { InviteTenantModal } from '@/components/tenant/InviteTenantModal';
import { useProperties } from '@/hooks/useProperties';

const Tenants: React.FC = () => {
  const { properties } = useProperties();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-heading font-semibold">Gestión de Inquilinos</h1>
          <p className="text-muted-foreground">
            Administra tus inquilinos e invita nuevos usuarios a tus propiedades
          </p>
        </div>
        <InviteTenantModal 
          properties={properties.map(p => ({ 
            id: p.id, 
            name: p.name, 
            rent_amount: p.rent_amount 
          }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Tenants List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Todos los Inquilinos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TenantsList showAll={true} />
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Tenants;