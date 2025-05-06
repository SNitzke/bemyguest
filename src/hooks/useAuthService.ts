
import { useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SignupData } from "@/types/auth";

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
      
      const role = await getUserRole(data.user?.id);
      
      if (role === 'landlord') {
        navigate("/landlord-profile");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to login");
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
      
      // Get the user ID from the signup response
      const userId = authData?.user?.id;
      
      if (data.role === 'landlord' && data.subscriptionPlan && userId) {
        // Create landlord details entry
        // Call the RPC function without type assertion
        const { error: detailsError } = await supabase.rpc('create_landlord_details', {
          user_id: userId,
          plan: data.subscriptionPlan
        });
          
        if (detailsError) {
          console.error("Error creating landlord details:", detailsError);
        }
      }
      
      toast.success("Account created successfully! Please verify your email.");
      navigate("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create account");
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
      toast.error(error instanceof Error ? error.message : "Failed to logout");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const switchRole = async () => {
    try {
      // This is a placeholder function - in a real app, you would update the user's role in your database
      toast.info("This feature is not yet implemented");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to switch role");
    }
  };

  return {
    isLoading,
    getUserRole,
    login,
    signup,
    logout,
    switchRole
  };
}
