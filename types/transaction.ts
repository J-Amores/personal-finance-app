export interface Transaction {
  id: string;
  description: string;
  category: string;
  date: Date;
  amount: number;
  type: 'income' | 'expense';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Balance {
  current: number;
  income: number;
  expenses: number;
}

export type SortOrder = 'latest' | 'oldest' | 'highest' | 'lowest';
export type CategoryFilter = 'all' | string;
