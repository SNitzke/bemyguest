import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_date: string | null;
  due_date: string;
  type: 'rent' | 'utilities' | 'deposit' | 'other';
  property_id?: string;
  tenant_id?: string;
}

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPayments = async () => {
    if (!user) {
      setPayments([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // For now, return empty array since payments table structure needs to be defined
      // This will be implemented when payment functionality is fully added
      setPayments([]);
      setError(null);
    } catch (err) {
      console.error('Error in fetchPayments:', err);
      setError('Error al cargar los pagos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  return {
    payments,
    isLoading,
    error,
    refetch: fetchPayments
  };
}