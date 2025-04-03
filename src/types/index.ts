
export type UserRole = "landlord" | "tenant" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  units: number;
  landlordId: string;
}

export interface Tenant {
  id: string;
  userId: string;
  propertyId: string;
  unitNumber: string;
  moveInDate: string;
  leaseEndDate: string;
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

export interface Property {
  id: string;
  name: string;
  address: string;
  units: number;
  landlordId: string;
  imageUrl: string;
}
