import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Property } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Building2, MapPin, DollarSign, Users, Calendar, FileText, Settings, Edit, Plus } from 'lucide-react';
import { toast } from 'sonner';
import PropertyStatusBadge from '@/components/properties/PropertyStatusBadge';
import TenantsList from '@/components/tenants/TenantsList';
import { EditPropertyModal } from '@/components/properties/EditPropertyModal';
import DeletePropertyDialog from '@/components/properties/DeletePropertyDialog';
import { InviteTenantModal } from '@/components/tenant/InviteTenantModal';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id || !user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching property:', error);
          toast.error('Error al cargar la propiedad');
          navigate('/properties');
          return;
        }

        if (data) {
          setProperty({
            id: data.id,
            name: data.name,
            address: data.address,
            imageUrl: data.image_url || '/placeholder.svg',
            units: data.units,
            landlordId: data.user_id,
            status: (data.status as 'vacant' | 'occupied' | 'maintenance') || 'vacant',
            rent_amount: data.rent_amount
          });
        }
      } catch (err) {
        console.error('Error in fetchProperty:', err);
        toast.error('Error al cargar la propiedad');
        navigate('/properties');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, user, navigate]);

  const handleEditProperty = async (updatedProperty: Property) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          name: updatedProperty.name,
          address: updatedProperty.address,
          units: updatedProperty.units,
          rent_amount: updatedProperty.rent_amount,
          status: updatedProperty.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedProperty.id);

      if (error) {
        console.error('Error updating property:', error);
        toast.error('Error al actualizar la propiedad');
        return;
      }

      setProperty(updatedProperty);
      toast.success('Propiedad actualizada correctamente');
    } catch (err) {
      console.error('Error in handleEditProperty:', err);
      toast.error('Error al actualizar la propiedad');
    }
  };

  const handleDeleteProperty = async () => {
    if (!property) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id);

      if (error) {
        console.error('Error deleting property:', error);
        toast.error('Error al eliminar la propiedad');
        return;
      }

      toast.success('Propiedad eliminada correctamente');
      navigate('/properties');
    } catch (err) {
      console.error('Error in handleDeleteProperty:', err);
      toast.error('Error al eliminar la propiedad');
    }
  };

  const getBadgeStatus = (status: string): "available" | "maintenance" | "alert" => {
    switch (status) {
      case 'vacant':
        return 'available';
      case 'maintenance':
        return 'maintenance';
      case 'occupied':
        return 'available';
      default:
        return 'available';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Propiedad no encontrada</h2>
        <Button onClick={() => navigate('/properties')}>
          Volver a propiedades
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/properties')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold">{property.name}</h1>
        <PropertyStatusBadge status={getBadgeStatus(property.status)} />
      </div>

      {/* Property Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información de la Propiedad
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setEditModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(true)}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <FileText className="h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{property.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{property.units} unidades</span>
              </div>
              {property.rent_amount && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${property.rent_amount.toLocaleString()}/mes</span>
                </div>
              )}
            </div>
            <div className="h-48 overflow-hidden rounded-lg">
              <img
                src={property.imageUrl}
                alt={property.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tenants" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tenants" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Inquilinos
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pagos
          </TabsTrigger>
          <TabsTrigger value="issues" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Problemas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Inquilinos de la Propiedad</h3>
            <Button
              onClick={() => setInviteModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Invitar Inquilino
            </Button>
          </div>
          <TenantsList propertyId={property.id} showAll={true} />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Los pagos aparecerán aquí cuando se implementen
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Problemas y Mantenimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Los problemas aparecerán aquí cuando se implementen
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <EditPropertyModal
        property={property}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onEdit={handleEditProperty}
      />

      <DeletePropertyDialog
        property={property}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDeleteProperty}
      />

      <InviteTenantModal
        properties={[{
          id: property.id,
          name: property.name,
          rent_amount: property.rent_amount
        }]}
      />
    </div>
  );
};

export default PropertyDetails;