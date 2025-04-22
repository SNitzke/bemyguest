
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Invitation } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: () => Promise<void>;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check active sessions and set up auth listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to login");
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success("Account created successfully! Please verify your email.");
      navigate("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create account");
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to logout");
      throw error;
    }
  };
  
  // Add switchRole function
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
      isLoading,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      switchRole,
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
