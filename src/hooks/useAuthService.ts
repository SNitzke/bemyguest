
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Definir interfaces explícitas para evitar errores de TypeScript
interface UserRole {
  role: string;
  user_role?: string;
}

export function useAuthService() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const getUserRole = async (userId: string): Promise<string | null> => {
    if (!userId) return null;

    try {
      // Usando parámetros de tipo explícitos
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

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      if (!data || !data.user) throw new Error('No user data');

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

  const signup = async (data: {
    email: string;
    password: string;
    fullName: string;
    role: string;
    phoneNumber: string;
    subscriptionPlan?: string;
  }) => {
    try {
      setIsLoading(true);
      const { error, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role,
            phone_number: data.phoneNumber,
            subscription_plan: data.subscriptionPlan
          },
        },
      });
      
      if (error) throw error;
      
      const userId = authData?.user?.id;
      
      if (data.role === 'landlord' && data.subscriptionPlan && userId) {
        // Usando any como solución temporal para el problema de tipos
        await supabase.rpc(
          'create_landlord_details', 
          { 
            user_id: userId, 
            plan: data.subscriptionPlan 
          } as any
        );
      }
      
      toast.success("Cuenta creada exitosamente. Por favor, verifica tu correo.");
      navigate("/login");
    } catch (error) {
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
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cerrar sesión");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const switchRole = async () => {
    try {
      toast.info("Esta función aún no está implementada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al cambiar de rol");
    }
  };

  // Demo login para pruebas
  const demoLogin = async (role: "landlord" | "tenant") => {
    const demoCredentials = {
      landlord: { email: "landlord@demo.com", password: "password123" },
      tenant: { email: "tenant@demo.com", password: "password123" }
    };
    
    try {
      await login(demoCredentials[role].email, demoCredentials[role].password);
    } catch (error) {
      console.error(`Error en demo login (${role}):`, error);
      toast.error(`Error en inicio de sesión de demostración: ${role}`);
    }
  };

  return {
    isLoading,
    getUserRole,
    login,
    signup,
    logout,
    switchRole,
    demoLogin
  };
}
