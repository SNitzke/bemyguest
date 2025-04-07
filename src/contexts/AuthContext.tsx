
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Invitation, PaymentMethod } from "../types";
import { users, getCurrentUser } from "../utils/mockData";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  switchRole: () => void; // For demo purposes only
  signup: (userData: SignupData) => Promise<void>;
  createTenantInvitation: (inviteData: InviteData) => Promise<string>;
  acceptInvitation: (inviteCode: string, tenantData: TenantData) => Promise<void>;
  verifyInvitation: (inviteCode: string) => Promise<Invitation | null>;
}

interface SignupData {
  fullName: string;
  email: string;
  role: "tenant" | "landlord";
  propertyInfo?: {
    name: string;
    address: string;
    units: number;
  };
  paymentInfo: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
}

interface InviteData {
  email: string;
  propertyId: string;
  unitNumber: string;
}

interface TenantData {
  fullName: string;
  email: string;
  password: string;
  paymentMethod: PaymentMethod;
  paymentInfo: {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
  };
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

  // Function to send notification email (mock implementation)
  const sendNotificationEmail = async (userData: any, userType: "landlord" | "tenant") => {
    try {
      // In a real implementation, this would be an API call to your backend
      // For now, we'll mock the email sending functionality
      console.log(`Sending notification email to bemeguestt@gmail.com about new ${userType} registration`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Log the data that would be sent in the email
      console.log("User data:", {
        type: userType,
        name: userData.fullName || userData.name,
        email: userData.email,
        registeredAt: new Date().toISOString(),
      });
      
      // In a real implementation with a backend, you would use a service like:
      // - Nodemailer if using Node.js
      // - SendGrid API
      // - Amazon SES
      // - Or other email service providers
      
      console.log("Notification email sent successfully");
    } catch (error) {
      console.error("Failed to send notification email:", error);
    }
  };

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

  const signup = async (userData: SignupData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send data to your backend/database
      // For now, we'll create a mock user and add it
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.fullName,
        email: userData.email,
        role: userData.role,
        avatarUrl: undefined,
      };
      
      // Simulate storing the new user
      // In a real app with Supabase, you would insert this data into your database
      
      // Send notification email about new landlord registration
      await sendNotificationEmail(userData, userData.role);
      
      setUser(newUser);
      sessionStorage.setItem("bemyguest-user", JSON.stringify(newUser));
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create account");
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

  // New functions for invitation flow
  const createTenantInvitation = async (inviteData: InviteData): Promise<string> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would create an invitation in your database
      // For now, we'll create a mock invitation code
      const inviteCode = `INVITE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      // Store the invitation code in sessionStorage for demo purposes
      const invitations = JSON.parse(sessionStorage.getItem("bemyguest-invitations") || "[]");
      const newInvitation: Invitation = {
        id: `invitation-${Date.now()}`,
        email: inviteData.email,
        propertyId: inviteData.propertyId,
        unitNumber: inviteData.unitNumber,
        landlordId: user?.id || "",
        status: "pending",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      };
      
      invitations.push({ code: inviteCode, invitation: newInvitation });
      sessionStorage.setItem("bemyguest-invitations", JSON.stringify(invitations));
      
      toast.success(`Invitation sent to ${inviteData.email}`);
      return inviteCode;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create invitation");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyInvitation = async (inviteCode: string): Promise<Invitation | null> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Look for the invitation in sessionStorage
      const invitations = JSON.parse(sessionStorage.getItem("bemyguest-invitations") || "[]");
      const inviteRecord = invitations.find((inv: any) => inv.code === inviteCode);
      
      if (!inviteRecord) {
        throw new Error("Invalid invitation code");
      }
      
      const invitation: Invitation = inviteRecord.invitation;
      
      // Check if invitation is expired
      if (new Date(invitation.expiresAt) < new Date()) {
        throw new Error("Invitation has expired");
      }
      
      return invitation;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to verify invitation");
      return null;
    }
  };

  const acceptInvitation = async (inviteCode: string, tenantData: TenantData): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Verify invitation first
      const invitation = await verifyInvitation(inviteCode);
      
      if (!invitation) {
        throw new Error("Invalid or expired invitation");
      }
      
      // Simulate API call to create tenant account
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create the tenant user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: tenantData.fullName,
        email: tenantData.email,
        role: "tenant",
        avatarUrl: undefined,
      };
      
      // In a real app, you would update the invitation status to "accepted"
      // and create a tenant record in your database
      
      // For the mock app, we'll update the invitation in sessionStorage
      const invitations = JSON.parse(sessionStorage.getItem("bemyguest-invitations") || "[]");
      const updatedInvitations = invitations.map((inv: any) => {
        if (inv.code === inviteCode) {
          return {
            ...inv,
            invitation: {
              ...inv.invitation,
              status: "accepted"
            }
          };
        }
        return inv;
      });
      sessionStorage.setItem("bemyguest-invitations", JSON.stringify(updatedInvitations));
      
      // Send notification email about new tenant registration
      await sendNotificationEmail({
        ...tenantData,
        invitationDetails: invitation
      }, "tenant");
      
      // Log in the new user
      setUser(newUser);
      sessionStorage.setItem("bemyguest-user", JSON.stringify(newUser));
      
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to accept invitation");
      throw error;
    } finally {
      setIsLoading(false);
    }
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
        signup,
        createTenantInvitation,
        verifyInvitation,
        acceptInvitation,
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
