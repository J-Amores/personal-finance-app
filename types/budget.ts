export interface Budget {
  id: string;
  name: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'yearly' | 'quarterly';
  startDate: string;
  endDate?: string;
  notes?: string;
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
