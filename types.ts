
export enum UserRole {
  DEVELOPER = 'DEVELOPER',
  CREATOR = 'CREATOR',
  BUYER = 'BUYER',
  ADMIN = 'ADMIN',
  ORGANIZER = 'ORGANIZER'
}

export enum PropertyStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected',
  SOLD = 'Sold'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
  companyName?: string;
  isVerified: boolean;
  avatarUrl?: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  status: PropertyStatus;
  developerId: string;
  imageUrl: string;
  stats: {
    views: number;
    leads: number;
  };
  bedrooms: number;
  bathrooms: number;
  sqft: number;
}

export interface WalletState {
  balance: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'payment';
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
}

export interface AppState {
  user: User | null;
  properties: Property[];
  wallet: WalletState;
  onboardingStep: number;
}
