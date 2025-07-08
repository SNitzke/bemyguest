import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { AcceptInvitationForm } from "../components/tenant/AcceptInvitationForm";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InvitationData {
  id: string;
  tenant_name: string;
  tenant_email: string;
  unit_number: string;
  rent_amount: number;
  status: string;
  property: {
    name: string;
    address: string;
  };
  landlord: {
    full_name: string;
    email: string;
  };
}

const TenantInvitation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inviteCode = searchParams.get("code") || "";
  const email = searchParams.get("email") || "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const verifyInvitation = async () => {
      if (!inviteCode || !email) {
        setError("Código de invitación o email faltante");
        setLoading(false);
        return;
      }

      try {
        // First get the invitation
        const { data: invitationData, error: invitationError } = await supabase
          .from('tenant_invitations')
          .select('*')
          .eq('invitation_code', inviteCode)
          .eq('tenant_email', email)
          .single();

        if (invitationError) throw invitationError;

        if (invitationData.status === 'expired' || new Date(invitationData.expires_at) < new Date()) {
          setError("Esta invitación ha expirado");
          setLoading(false);
          return;
        }

        if (invitationData.status === 'accepted') {
          setError("Esta invitación ya ha sido aceptada");
          setLoading(false);
          return;
        }

        // Get property details
        const { data: propertyData } = await supabase
          .from('properties')
          .select('name, address')
          .eq('id', invitationData.property_id)
          .single();

        // Get landlord details
        const { data: landlordData } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', invitationData.landlord_id)
          .single();

        setInvitationData({
          ...invitationData,
          property: propertyData || { name: '', address: '' },
          landlord: landlordData || { full_name: '', email: '' }
        });
      } catch (error) {
        console.error('Error verifying invitation:', error);
        setError("Invitación no válida o expirada");
      } finally {
        setLoading(false);
      }
    };

    verifyInvitation();
  }, [inviteCode, email]);
  
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      // In a real implementation, this would create a tenant account
      // and mark the invitation as accepted
      toast.success("Invitación aceptada exitosamente");
      
      // Update invitation status
      await supabase
        .from('tenant_invitations')
        .update({ status: 'accepted' })
        .eq('invitation_code', inviteCode);

      // Redirect to tenant dashboard or login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast.error("Error al aceptar la invitación");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
            <h1 className="text-xl font-semibold mb-2">Verificando invitación...</h1>
            <p className="text-muted-foreground">Por favor espera un momento</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/5 to-destructive/10 p-4">
        <div className="w-full max-w-md">
          <Link 
            to="/" 
            className="flex items-center text-destructive hover:text-destructive/80 mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
          
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Invitación no válida</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link 
              to="/" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className="flex items-center text-primary hover:text-primary/80 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="text-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Invitación de Inquilino</h1>
            <p className="text-muted-foreground">
              Has sido invitado a rentar una propiedad
            </p>
          </div>

          {invitationData && (
            <div className="bg-muted p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-3">Detalles de la Invitación:</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Nombre:</strong> {invitationData.tenant_name}</p>
                <p><strong>Propiedad:</strong> {invitationData.property.name}</p>
                <p><strong>Dirección:</strong> {invitationData.property.address}</p>
                <p><strong>Unidad:</strong> {invitationData.unit_number}</p>
                <p><strong>Renta Mensual:</strong> ${invitationData.rent_amount}</p>
                <p><strong>Propietario:</strong> {invitationData.landlord.full_name}</p>
                <p><strong>Email del Propietario:</strong> {invitationData.landlord.email}</p>
              </div>
            </div>
          )}
          
          <AcceptInvitationForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            invitationData={invitationData}
          />
        </div>
      </div>
    </div>
  );
};

export default TenantInvitation;