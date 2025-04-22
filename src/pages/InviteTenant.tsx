
import React from "react";
import { InviteTenantForm } from "../components/tenant/InviteTenantForm";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";

// Mock property data - In a real app, this would come from your database
const mockProperties = [
  { id: "prop-1", name: "Sunset Apartments", units: 10 },
  { id: "prop-2", name: "Ocean View Condos", units: 5 },
  { id: "prop-3", name: "Mountain Retreat", units: 3 },
];

const InviteTenant: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userMetadata = user?.user_metadata as { role?: string } | undefined;
  
  if (userMetadata?.role !== "landlord") {
    return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">Only landlords can invite tenants.</p>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <h1 className="text-3xl font-bold mb-8 text-center">Invite a Tenant</h1>
      
      <div className="max-w-md mx-auto">
        <InviteTenantForm 
          properties={mockProperties} 
          onSubmit={(values) => console.log(values)}
          isSubmitting={false}
        />
      </div>
    </div>
  );
};

export default InviteTenant;
