
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SignupData, Profile } from "@/types/auth";

export function useAuthService() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getUserRole = async (userId: string): Promise<string | null> => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data?.role || null;
    } catch (error) {
      console.error("Error getting user role:", error);
      return null;
    }
  };

  const getProfile = async (userId: string): Promise<Profile | null> => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as Profile;
    } catch (error) {
      console.error("Error getting user profile:", error);
      return null;
    }
  };

  const updateProfile = async (userId: string, profileData: Partial<Profile>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error al actualizar el perfil");
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error, data } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      if (!data || !data.user) throw new Error('No se recibieron datos del usuario');

      const role = await getUserRole(data.user.id);

      if (role === 'landlord') {
        navigate("/landlord-profile");
      } else {
        navigate("/dashboard");
      }
      
      toast.success("¡Inicio de sesión exitoso!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al iniciar sesión");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      setIsLoading(true);
      
      console.log("Iniciando registro con datos:", data);
      
      // Registrar usuario en Supabase Auth
      const { error: authError, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: data.fullName,
            role: data.role,
            phone_number: data.phoneNumber,
            subscription_plan: data.subscriptionPlan
          },
        },
      });
      
      if (authError) {
        console.error("Error en auth.signUp:", authError);
        throw authError;
      }
      
      console.log("Usuario creado en auth:", authData);
      
      const userId = authData?.user?.id;
      
      if (!userId) {
        throw new Error("No se pudo obtener el ID del usuario");
      }

      // Crear perfil manualmente para asegurar que se cree
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: data.email,
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          role: data.role
        });

      if (profileError) {
        console.error("Error creando perfil:", profileError);
        // No lanzar error aquí, el trigger debería manejarlo
      }

      // Si es landlord, crear detalles de landlord
      if (data.role === 'landlord' && data.subscriptionPlan) {
        const { error: landlordError } = await supabase.rpc('create_landlord_details', {
          user_id: userId,
          plan: data.subscriptionPlan
        });
        
        if (landlordError) {
          console.error("Error creando detalles de landlord:", landlordError);
        }
      }
      
      toast.success("¡Cuenta creada exitosamente! Puedes iniciar sesión ahora.");
      
      // Redirigir al login
      navigate("/login");
      
    } catch (error) {
      console.error("Error completo en signup:", error);
      toast.error(error instanceof Error ? error.message : "Error al crear la cuenta");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cerrar sesión");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const switchRole = async () => {
    try {
      toast.info("Esta funcionalidad aún no está implementada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cambiar rol");
    }
  };

  // Demo login actualizado con usuarios reales
  const demoLogin = async (role: "landlord" | "tenant") => {
    const demoCredentials = {
      landlord: { email: "demo.landlord@example.com", password: "demo123456" },
      tenant: { email: "demo.tenant@example.com", password: "demo123456" }
    };
    
    try {
      await login(demoCredentials[role].email, demoCredentials[role].password);
    } catch (error) {
      console.error(`Error in demo login (${role}):`, error);
      toast.error(`Los usuarios demo no existen aún. Por favor registra una cuenta nueva.`);
    }
  };

  return {
    isLoading,
    getUserRole,
    getProfile,
    updateProfile,
    login,
    signup,
    logout,
    switchRole,
    demoLogin
  };
}
