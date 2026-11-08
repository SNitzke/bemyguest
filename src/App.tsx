import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useParams, useSearchParams } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import RoleRoute from "./components/layout/RoleRoute";
import Index from "./pages/Index";
import DemoPage from "./pages/Demo";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import Invite from "./pages/Invite";
import Pricing from "./pages/Pricing";
import LandlordHome from "./pages/landlord/LandlordHome";
import Properties from "./pages/landlord/Properties";
import PropertyDetail from "./pages/landlord/PropertyDetail";
import Tenants from "./pages/landlord/Tenants";
import TenantHome from "./pages/tenant/TenantHome";
import Payments from "./pages/Payments";
import Issues from "./pages/Issues";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } });

// Legacy invitation links (?code=...) keep working
const LegacyInvite = () => {
  const [params] = useSearchParams();
  const code = params.get("code");
  return <Navigate to={code ? `/invite/${code}` : "/"} replace />;
};
const LegacyPropertyRedirect = () => <Navigate to={`/properties/${useParams().id}`} replace />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner richColors position="top-center" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/invite/:code" element={<Invite />} />
            <Route path="/tenant-invitation" element={<LegacyInvite />} />
            <Route path="/property/:id" element={<LegacyPropertyRedirect />} />

            <Route element={<AppLayout />}>
              <Route path="/landlord-profile" element={<RoleRoute role="landlord"><LandlordHome /></RoleRoute>} />
              <Route path="/properties" element={<RoleRoute role="landlord"><Properties /></RoleRoute>} />
              <Route path="/properties/:id" element={<RoleRoute role="landlord"><PropertyDetail /></RoleRoute>} />
              <Route path="/tenants" element={<RoleRoute role="landlord"><Tenants /></RoleRoute>} />
              <Route path="/dashboard" element={<RoleRoute role="tenant"><TenantHome /></RoleRoute>} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/issues" element={<Issues />} />
              <Route path="/report-issue" element={<Navigate to="/issues" replace />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
