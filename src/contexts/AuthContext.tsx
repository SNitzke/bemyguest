
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from "@/types/auth";
import { useAuthService } from "@/hooks/useAuthService";
import { useInvitations } from "@/hooks/useInvitations";

// Create context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize our custom hooks
  const authService = useAuthService();
  const invitationService = useInvitations();

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

  // We need to define this here because it needs the current user
  const getUserRole = async (): Promise<string | null> => {
    if (!user) return null;
    return authService.getUserRole(user.id);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading: isLoading || authService.isLoading,
      isAuthenticated: !!user,
      login: authService.login,
      signup: authService.signup,
      logout: authService.logout,
      switchRole: authService.switchRole,
      getUserRole,
      ...invitationService
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

// Export LandlordDetails interface from the types file
export type { LandlordDetails } from "@/types/auth";
