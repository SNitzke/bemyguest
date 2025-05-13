
import { User, Session } from "@supabase/supabase-js";
import { Invitation } from "@/types";

export interface SignupData {
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

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: () => Promise<void>;
  demoLogin: (role: "landlord" | "tenant") => Promise<void>;
  getUserRole: () => Promise<string | null>;
  // Add tenant invitation methods
  verifyInvitation?: (code: string, email: string) => Promise<Invitation | null>;
  acceptInvitation?: (code: string, email: string, password: string) => Promise<void>;
  createTenantInvitation?: (email: string, propertyId: string, unitNumber: string) => Promise<{ id: string }>;
}
