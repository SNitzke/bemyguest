
export type UserRole = "landlord" | "tenant" | "admin";
export type PaymentMethod = "credit" | "debit" | "cash";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phoneNumber?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  units: number;
  landlordId: string;
  status: 'vacant' | 'occupied' | 'maintenance'; // Add status property
  rent_amount?: number;
}

export interface Tenant {
  id: string;
  userId: string;
  propertyId: string;
  unitNumber: string;
  moveInDate: string;
  leaseEndDate: string;
  paymentMethod: PaymentMethod;
}

export interface Invitation {
  id: string;
  email: string;
  propertyId: string;
  unitNumber: string;
  landlordId: string;
  status: "pending" | "accepted" | "expired";
  createdAt: string;
  expiresAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  imageUrls: string[];
  status: "new" | "inProgress" | "resolved";
  createdAt: string;
  tenantId: string;
  propertyId: string;
}

export interface Payment {
  id: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  paymentDate: string;
  dueDate: string;
  type: "rent" | "utilities" | "other";
  tenantId: string;
  propertyId: string;
  landlordId?: string;
  description?: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
  read: boolean;
}

export interface FinancialData {
  month: string;
  income: number;
  expenses: number;
  netProfit: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthly_price: number;
  features: {
    max_properties: number | 'unlimited';
    support: 'email' | 'priority' | 'dedicated' | '24/7';
  };
}

export interface PaymentDetails {
  amount: number;
  description?: string;
  due_date?: string;
  payment_date?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface LandlordSubscription {
  id: string;
  landlord_id: string;
  plan_id: string;
  status: string;
  start_date: string;
  end_date?: string;
  plan?: SubscriptionPlan;
}
