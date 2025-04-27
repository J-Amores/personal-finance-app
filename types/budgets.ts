export interface Budget {
  id: string;
  name: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'yearly';
  startDate: string;
  color?: string;
}

export type BudgetSortOrder = 'overspent' | 'progress' | 'alphabetical';
