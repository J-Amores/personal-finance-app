export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pot {
  id: string;
  name: string;
  target: number;
  total: number;
  theme: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  name: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate?: string | null;
  notes?: string | null;
  isRecurring: boolean;
  alerts: {
    enabled: boolean;
    threshold?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  isPaid: boolean;
  automaticPayment: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}
