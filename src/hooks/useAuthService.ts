
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SignupData } from "@/types/auth";

// Define interfaces for type safety
interface UserRole {
  role: string;
  user_role?: string;
}

// Type for RPC parameters
interface RpcParams {
  [key: string]: any;
}

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
      
      toast.success("Login successful!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error logging in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
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
        // Updated RPC parameters with proper typing
        const params: RpcParams = { 
          user_id: userId, 
          plan: data.subscriptionPlan 
        };
        
        await supabase.rpc<null, string>('create_landlord_details', params as any);
      }
      
      toast.success("Account created successfully. Please verify your email.");
      navigate("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error creating account");
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
      toast.error(error instanceof Error ? error.message : "Error logging out");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const switchRole = async () => {
    try {
      toast.info("This feature is not yet implemented");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error switching role");
    }
  };

  // Demo login for testing
  const demoLogin = async (role: "landlord" | "tenant") => {
    const demoCredentials = {
      landlord: { email: "landlord@demo.com", password: "password123" },
      tenant: { email: "tenant@demo.com", password: "password123" }
    };
    
    try {
      await login(demoCredentials[role].email, demoCredentials[role].password);
    } catch (error) {
      console.error(`Error in demo login (${role}):`, error);
      toast.error(`Error in demo login: ${role}`);
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
