export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'yearly';
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetProgress {
  percentage: number;
  status: 'under' | 'near' | 'over';
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
}
