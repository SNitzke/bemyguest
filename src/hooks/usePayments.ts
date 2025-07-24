import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_type: 'rent' | 'deposit' | 'utilities' | 'late_fee' | 'other';
  due_date: string;
  payment_date: string | null;
  payment_method?: string;
  description?: string;
  reference_number?: string;
  property_id?: string;
  tenant_id?: string;
  landlord_id: string;
  created_at: string;
  updated_at: string;
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
      
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('landlord_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        setError(error.message);
        return;
      }

      setPayments((data || []).map(payment => ({
        ...payment,
        status: payment.status as 'pending' | 'completed' | 'failed' | 'refunded',
        payment_type: payment.payment_type as 'rent' | 'deposit' | 'utilities' | 'late_fee' | 'other'
      })));
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