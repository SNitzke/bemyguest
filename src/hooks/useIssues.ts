import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'inProgress' | 'resolved';
  created_at: string;
  property_id: string;
  tenant_id?: string;
}

export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchIssues = async () => {
    if (!user) {
      setIssues([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // First get user's properties to filter issues
      const { data: userProperties } = await supabase
        .from('properties')
        .select('id')
        .eq('user_id', user.id);

      if (!userProperties || userProperties.length === 0) {
        setIssues([]);
        setIsLoading(false);
        return;
      }

      const propertyIds = userProperties.map(p => p.id);

      // For now, return empty array since issues table doesn't exist yet
      // This will be implemented when issues functionality is added
      setIssues([]);
      setError(null);
    } catch (err) {
      console.error('Error in fetchIssues:', err);
      setError('Error al cargar los problemas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [user]);

  return {
    issues,
    isLoading,
    error,
    refetch: fetchIssues
  };
}