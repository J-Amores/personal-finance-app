export type Period = 'monthly' | 'quarterly' | 'yearly';

export interface Budget {
  id: string;
  name: string;
  category: string;
  amount: number;
  spent: number;
  period: Period;
  startDate: string;
  endDate: string | undefined;
  notes: string | undefined;
  isRecurring: boolean;
  alerts: {
    enabled: boolean;
    threshold?: number;
  };
  createdAt: string;
  updatedAt: string;
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
