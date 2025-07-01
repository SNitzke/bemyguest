
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TenantProfile from '@/components/tenant/TenantProfile';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();

  // For tenants, show the tenant profile/dashboard
  return <TenantProfile />;
};

export default Dashboard;
