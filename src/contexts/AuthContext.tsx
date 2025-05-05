
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Invitation } from "@/types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: () => Promise<void>;
  getUserRole: () => Promise<string | null>;
  // Add tenant invitation methods
  verifyInvitation?: (code: string, email: string) => Promise<Invitation | null>;
  acceptInvitation?: (code: string, email: string, password: string) => Promise<void>;
  createTenantInvitation?: (email: string, propertyId: string, unitNumber: string) => Promise<{ id: string }>;
}

interface SignupData {
  email: string;
  password: string;
  fullName: string;
  role: "tenant" | "landlord";
  phoneNumber: string;
  subscriptionPlan?: string;
}

// Define the LandlordDetails interface to fix type errors
export interface LandlordDetails {
  id?: string;
  company_name: string | null;
  subscription_plan: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getUserRole = async (): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
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
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      const role = await getUserRole();
      
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
        // Create landlord details entry using a custom SQL function or via API
        // Fix the type error by using the proper parameter type for user_id
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

  // Add stub tenant invitation methods
  const verifyInvitation = async (code: string, email: string): Promise<Invitation | null> => {
    // This would normally check if an invitation is valid in a real app
    toast.info("Invitation verification is not yet implemented");
    return null;
  };

  const acceptInvitation = async (code: string, email: string, password: string): Promise<void> => {
    // This would normally accept an invitation and create a tenant account in a real app
    toast.info("Invitation acceptance is not yet implemented");
  };

  const createTenantInvitation = async (email: string, propertyId: string, unitNumber: string): Promise<{ id: string }> => {
    // This would normally create a tenant invitation in a real app
    toast.info("Tenant invitation creation is not yet implemented");
    return { id: "placeholder-id" };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      switchRole,
      getUserRole,
      verifyInvitation,
      acceptInvitation,
      createTenantInvitation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export the LandlordDetails interface for use in other components
export type { LandlordDetails };
