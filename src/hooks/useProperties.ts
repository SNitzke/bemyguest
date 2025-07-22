import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Property } from '@/types';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProperties = async () => {
    if (!user) {
      setProperties([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        setError(error.message);
        return;
      }

      // Transform Supabase data to Property type
      const transformedProperties: Property[] = (data || []).map(prop => ({
        id: prop.id,
        name: prop.name,
        address: prop.address,
        imageUrl: prop.image_url || '/placeholder.svg',
        units: prop.units,
        landlordId: prop.user_id,
        status: (prop.status as 'vacant' | 'occupied' | 'maintenance') || 'vacant',
        rent_amount: prop.rent_amount
      }));

      setProperties(transformedProperties);
      setError(null);
    } catch (err) {
      console.error('Error in fetchProperties:', err);
      setError('Error al cargar las propiedades');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user]);

  return {
    properties,
    isLoading,
    error,
    refetch: fetchProperties
  };
}