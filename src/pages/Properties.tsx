import React, { useState, useEffect } from 'react';
import PropertySearch from '../components/properties/PropertySearch';
import PropertyCard from '../components/dashboard/PropertyCard';
import { AddPropertyModal } from '../components/properties/AddPropertyModal';
import { PropertyActions } from '../components/properties/PropertyActions';
import { InviteTenantModal } from '../components/tenant/InviteTenantModal';
import { properties as initialProperties } from '../utils/mockData';
import { Property } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Properties = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load properties from Supabase
  useEffect(() => {
    const loadProperties = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const mappedProperties: Property[] = (data || []).map(prop => ({
          id: prop.id,
          name: prop.name,
          address: prop.address,
          units: prop.units,
          imageUrl: prop.image_url || '/placeholder.svg',
          landlordId: prop.user_id,
          status: (prop.status as 'vacant' | 'occupied' | 'maintenance') || 'vacant',
          rent_amount: prop.rent_amount
        }));

        setProperties(mappedProperties);
      } catch (error) {
        console.error('Error loading properties:', error);
        toast.error('Error al cargar las propiedades');
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, [user]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterClick = () => {
    // Implement filter modal/dropdown logic
    console.log('Filter clicked');
  };

  const handleAddProperty = async (newProperty: { name: string; address: string; units: number; rentAmount: number }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Debes estar autenticado para agregar propiedades');
        return;
      }

      const { data, error } = await supabase
        .from('properties')
        .insert({
          name: newProperty.name,
          address: newProperty.address,
          units: newProperty.units,
          rent_amount: newProperty.rentAmount,
          user_id: user.id,
          status: 'vacant'
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state with the new property from database
      const property: Property = {
        id: data.id,
        name: data.name,
        address: data.address,
        units: data.units,
        imageUrl: data.image_url || '/placeholder.svg',
        landlordId: data.user_id,
        status: (data.status as 'vacant' | 'occupied' | 'maintenance') || 'vacant',
        rent_amount: data.rent_amount
      };
      
      setProperties(prev => [...prev, property]);
      toast.success('Propiedad agregada exitosamente');
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Error al agregar la propiedad');
    }
  };

  const handleEditProperty = (updatedProperty: Property) => {
    setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
  };

  const handleDeleteProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Properties</h1>
        <p className="text-muted-foreground">
          Manage and monitor your property portfolio
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <PropertySearch
          onSearch={handleSearch}
          onFilterClick={handleFilterClick}
        />
        <div className="flex gap-2">
          <AddPropertyModal onAddProperty={handleAddProperty} />
          <InviteTenantModal properties={properties.map(p => ({ 
            id: p.id, 
            name: p.name, 
            rent_amount: p.rent_amount 
          }))} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="relative">
            <PropertyCard property={property} />
            <div className="absolute top-2 right-2">
              <PropertyActions
                property={property}
                onEdit={handleEditProperty}
                onDelete={handleDeleteProperty}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Properties;
