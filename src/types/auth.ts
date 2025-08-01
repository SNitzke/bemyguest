
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

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role: "tenant" | "landlord";
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface LandlordDetails {
  id: string;
  user_id: string;
  company_name?: string;
  business_name?: string;
  address?: string;
  subscription_plan: string;
  subscription_status: 'pending' | 'active' | 'inactive' | 'cancelled';
  subscription_start_date?: string;
  subscription_end_date?: string;
  payment_verified: boolean;
  properties_count: number;
  max_properties: number;
  verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: () => Promise<void>;
  getUserRole: () => Promise<string | null>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  // Add tenant invitation methods
  verifyInvitation?: (code: string, email: string) => Promise<Invitation | null>;
  acceptInvitation?: (code: string, email: string, password: string) => Promise<void>;
  createTenantInvitation?: (email: string, propertyId: string, unitNumber: string) => Promise<{ id: string }>;
}
