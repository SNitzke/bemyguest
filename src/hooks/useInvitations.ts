
import { toast } from "sonner";
import { Invitation } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export function useInvitations() {
  const verifyInvitation = async (code: string, email: string): Promise<Invitation | null> => {
    try {
      const { data, error } = await supabase
        .from('tenant_invitations')
        .select(`
          *,
          properties (
            name,
            address
          )
        `)
        .eq('invitation_code', code)
        .eq('tenant_email', email)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error) {
        console.error('Error verifying invitation:', error);
        return null;
      }

      return {
        id: data.id,
        code: data.invitation_code,
        email: data.tenant_email,
        tenantName: data.tenant_name,
        propertyName: data.properties?.name || '',
        propertyAddress: data.properties?.address || '',
        unitNumber: data.unit_number,
        rentAmount: data.rent_amount,
        expiresAt: data.expires_at
      };
    } catch (error) {
      console.error('Error verifying invitation:', error);
      toast.error('Error al verificar la invitación');
      return null;
    }
  };

  const acceptInvitation = async (code: string, email: string, password: string): Promise<void> => {
    try {
      // First create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'tenant'
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Update invitation status
        const { error: updateError } = await supabase
          .from('tenant_invitations')
          .update({ status: 'accepted' })
          .eq('invitation_code', code)
          .eq('tenant_email', email);

        if (updateError) throw updateError;

        toast.success('¡Invitación aceptada exitosamente! Bienvenido.');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error('Error al aceptar la invitación');
      throw error;
    }
  };

  const createTenantInvitation = async (email: string, propertyId: string, unitNumber: string): Promise<{ id: string }> => {
    // This is now handled in InviteTenantModal component
    toast.info("Use el modal de invitación para crear invitaciones");
    return { id: "placeholder-id" };
  };

  return {
    verifyInvitation,
    acceptInvitation,
    createTenantInvitation
  };
}
