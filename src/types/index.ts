export type TransactionType = 'income' | 'expense';

export type CategoryType = 
  | 'food'
  | 'rent'
  | 'transport'
  | 'bills'
  | 'shopping'
  | 'salary'
  | 'entertainment'
  | 'health'
  | 'other';

export interface Transaction {
  id: string;
  amount: number;
  category: CategoryType;
  type: TransactionType;
  date: string; // ISO format
  notes?: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
}

export interface Settings {
  language: string;
  countryCode: string;
  currencyCode: string;
  pinEnabled: boolean;
  biometricEnabled: boolean;
  isOnboarded: boolean;
}

export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
}
