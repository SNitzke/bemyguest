
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType, Profile } from "@/types/auth";
import { useAuthService } from "@/hooks/useAuthService";
import { useInvitations } from "@/hooks/useInvitations";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const authService = useAuthService();
  const invitationService = useInvitations();

  // Función para cargar el perfil
  const loadProfile = async (userId: string) => {
    try {
      console.log("Cargando perfil para usuario:", userId);
      const profileData = await authService.getProfile(userId);
      console.log("Perfil cargado:", profileData);
      setProfile(profileData);
    } catch (error) {
      console.error("Error loading profile:", error);
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      // Load profile when user logs in
      if (session?.user) {
        setTimeout(async () => {
          if (mounted) {
            await loadProfile(session.user.id);
          }
        }, 100);
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log("Sesión existente:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadProfile(session.user.id);
      }
      
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const getUserRole = async (): Promise<string | null> => {
    if (!user) return null;
    return authService.getUserRole(user.id);
  };

  const updateProfile = async (data: Partial<Profile>): Promise<void> => {
    if (!user) throw new Error("No user logged in");
    
    await authService.updateProfile(user.id, data);
    
    // Refresh profile after update
    await loadProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      isLoading: isLoading || authService.isLoading,
      isAuthenticated: !!user,
      login: authService.login,
      signup: authService.signup,
      logout: authService.logout,
      switchRole: authService.switchRole,
      demoLogin: authService.demoLogin,
      getUserRole,
      updateProfile,
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

export type { Profile, LandlordDetails } from "@/types/auth";
