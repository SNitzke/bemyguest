
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AcceptInvitationForm } from "../components/tenant/AcceptInvitationForm";
import { ArrowLeft } from "lucide-react";

const TenantInvitation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get("code") || "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (values: any) => {
    setIsSubmitting(true);
    console.log("Processing invitation:", values);
    // Implementation would go here
    setTimeout(() => setIsSubmitting(false), 1000);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bmg-50 to-bmg-100 p-4">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="flex items-center text-bmg-600 hover:text-bmg-700 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Accept Invitation</h1>
          <AcceptInvitationForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default TenantInvitation;
