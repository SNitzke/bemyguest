
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { users, getCurrentUser } from "../utils/mockData";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  switchRole: () => void; // For demo purposes only
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in session storage
    const storedUser = sessionStorage.getItem("bemyguest-user");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching email (in a real app, this would be a backend call)
      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // In a real app, you would validate the password here
      
      setUser(foundUser);
      sessionStorage.setItem("bemyguest-user", JSON.stringify(foundUser));
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to login");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("bemyguest-user");
    toast.info("Logged out successfully");
  };

  // For demo purposes only - to switch between landlord and tenant views
  const switchRole = () => {
    if (!user) return;
    
    const newRole = user.role === "landlord" ? "tenant" : "landlord";
    const newUser = users.find(u => u.role === newRole) || user;
    
    setUser(newUser);
    sessionStorage.setItem("bemyguest-user", JSON.stringify(newUser));
    toast.info(`Switched to ${newRole} view`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        switchRole,
      }}
    >
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
