import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Tenant {
  id: string;
  user_id: string | null;
  property_id: string;
  landlord_id: string;
  unit_number: string;
  move_in_date: string | null;
  lease_end_date: string | null;
  rent_amount: number | null;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

export function useTenants() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTenants = async () => {
    if (!user) {
      setTenants([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('landlord_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tenants:', error);
        setError(error.message);
        return;
      }

      setTenants((data || []).map(tenant => ({
        ...tenant,
        status: tenant.status as 'active' | 'inactive' | 'pending'
      })));
      setError(null);
    } catch (err) {
      console.error('Error in fetchTenants:', err);
      setError('Error al cargar los inquilinos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [user]);

  return {
    tenants,
    isLoading,
    error,
    refetch: fetchTenants
  };
}