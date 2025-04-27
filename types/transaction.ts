export interface Transaction {
  id: string;
  name: string;
  avatar: string;
  category: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface Balance {
  current: number;
  income: number;
  expenses: number;
}

export type SortOrder = 'latest' | 'oldest' | 'highest' | 'lowest';
export type CategoryFilter = 'all' | string;
