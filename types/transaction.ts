export interface Transaction {
  id: string;
  name: string;
  avatar: string;
  category: string;
  date: string;
  amount: number;
}

export type SortOrder = 'latest' | 'oldest' | 'highest' | 'lowest';
export type CategoryFilter = 'all' | string;
