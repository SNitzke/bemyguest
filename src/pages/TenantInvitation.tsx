
import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AcceptInvitationForm from "../components/tenant/AcceptInvitationForm";
import { ArrowLeft } from "lucide-react";

const TenantInvitation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get("code") || undefined;
  
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
        
        <AcceptInvitationForm inviteCode={inviteCode} />
      </div>
    </div>
  );
};

export default TenantInvitation;
