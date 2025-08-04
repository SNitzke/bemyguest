
import React, { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import AppLayout from './components/layout/AppLayout';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import Issues from './pages/Issues';
import Payments from './pages/Payments';
import Messages from './pages/Messages';
import Index from './pages/Index';
import SignUp from './pages/SignUp';
import TenantInvitation from './pages/TenantInvitation';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Settings from './pages/Settings';
import LandlordProfile from './pages/LandlordProfile';
import Tenants from './pages/Tenants';

const queryClient = new QueryClient();

// Protected route component with role check
const ProtectedRoute = ({ 
  children, 
  requiredRole
}: { 
  children: React.ReactNode;
  requiredRole?: 'tenant' | 'landlord'; 
}) => {
  const { isAuthenticated, isLoading, getUserRole, user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [roleChecked, setRoleChecked] = useState(false);

  useEffect(() => {
    if (user && requiredRole) {
      getUserRole().then(userRole => {
        setRole(userRole);
        setRoleChecked(true);
      });
    } else {
      setRoleChecked(true);
    }
  }, [user, requiredRole, getUserRole]);

  if (isLoading || !roleChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Redirect landlords to landlord profile, tenants to dashboard
    if (role === 'landlord') {
      return <Navigate to="/landlord-profile" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/tenant-invitation" element={<TenantInvitation />} />
      
      {/* Protected Routes within AppLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Tenant Routes */}
        <Route path="dashboard" element={
          <ProtectedRoute requiredRole="tenant">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="report-issue" element={
          <ProtectedRoute requiredRole="tenant">
            <ReportIssue />
          </ProtectedRoute>
        } />
        
        {/* Shared Routes */}
        <Route path="issues" element={<Issues />} />
        <Route path="payments" element={<Payments />} />
        <Route path="messages" element={<Messages />} />
        <Route path="settings" element={<Settings />} />
        
        {/* Landlord Routes */}
        <Route path="landlord-profile" element={
          <ProtectedRoute requiredRole="landlord">
            <LandlordProfile />
          </ProtectedRoute>
        } />
        <Route path="properties" element={
          <ProtectedRoute requiredRole="landlord">
            <Properties />
          </ProtectedRoute>
        } />
        <Route path="properties/:id" element={
          <ProtectedRoute requiredRole="landlord">
            <PropertyDetails />
          </ProtectedRoute>
        } />
        <Route path="tenants" element={
          <ProtectedRoute requiredRole="landlord">
            <Tenants />
          </ProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
