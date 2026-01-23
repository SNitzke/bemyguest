import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionState {
  isLoading: boolean;
  subscribed: boolean;
  planName: string | null;
  productId: string | null;
  subscriptionEnd: string | null;
  maxProperties: number;
  error: string | null;
}

export function useSubscription() {
  const { user, profile } = useAuth();
  const [state, setState] = useState<SubscriptionState>({
    isLoading: true,
    subscribed: false,
    planName: null,
    productId: null,
    subscriptionEnd: null,
    maxProperties: 0,
    error: null,
  });

  const checkSubscription = useCallback(async () => {
    if (!user || profile?.role !== 'landlord') {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setState({
        isLoading: false,
        subscribed: data.subscribed || false,
        planName: data.plan_name || null,
        productId: data.product_id || null,
        subscriptionEnd: data.subscription_end || null,
        maxProperties: data.max_properties || 0,
        error: null,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al verificar suscripción',
      }));
    }
  }, [user, profile?.role]);

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!user || profile?.role !== 'landlord') return;

    const interval = setInterval(checkSubscription, 60000);
    return () => clearInterval(interval);
  }, [user, profile?.role, checkSubscription]);

  const openCheckout = async (priceId: string, planName: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa');

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, planName },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Open checkout in new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening checkout:', error);
      throw error;
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa');

      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      throw error;
    }
  };

  return {
    ...state,
    checkSubscription,
    openCheckout,
    openCustomerPortal,
  };
}
