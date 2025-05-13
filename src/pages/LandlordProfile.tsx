
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { properties, issues, payments, financialData } from '../utils/mockData';

// Import components
import SubscriptionCard from '../components/landlord/SubscriptionCard';
import MetricsCards from '../components/landlord/MetricsCards';
import ProfileInfoCard from '../components/landlord/ProfileInfoCard';
import DashboardTabs from '../components/landlord/DashboardTabs';
import LoadingState from '../components/landlord/LoadingState';
import FinancialChart from '../components/dashboard/FinancialChart';

// Define interfaces for landlord details
export interface LandlordDetails {
  id?: string;
  company_name?: string | null;
  subscription_plan?: string | null;
  subscription_start_date?: string | null;
  subscription_end_date?: string | null;
}

const LandlordProfile: React.FC = () => {
  const { user } = useAuth();
  const [landlordDetails, setLandlordDetails] = useState<LandlordDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchLandlordDetails = async () => {
      if (!user) return;
      
      try {
        // Uso de any como solución para problemas de tipos con RPC
        const response = await supabase.rpc(
          'get_landlord_details', 
          { user_id: user.id } as any
        );
        
        if (response.error) {
          console.error("Error fetching landlord details:", response.error);
          return;
        }
        
        // Usar aserciones de tipo para manejar la respuesta
        setLandlordDetails(response.data as LandlordDetails);
      } catch (err) {
        console.error("Error in landlord details fetch:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLandlordDetails();
  }, [user]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Landlord Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.user_metadata?.full_name || 'Landlord'}. Manage your property portfolio
        </p>
      </div>
      
      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          {/* Subscription Info */}
          <SubscriptionCard landlordDetails={landlordDetails} />

          {/* Key Metrics */}
          <MetricsCards 
            properties={properties} 
            issues={issues} 
            payments={payments} 
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <ProfileInfoCard user={user} />

            {/* Main Content Area */}
            <DashboardTabs 
              properties={properties} 
              issues={issues} 
              payments={payments} 
            />
          </div>
          
          {/* Financial Chart */}
          <div className="mt-6">
            <FinancialChart data={financialData} />
          </div>
        </>
      )}
    </div>
  );
};

export default LandlordProfile;
