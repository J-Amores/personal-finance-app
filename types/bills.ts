export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  category: string;
  recurring?: boolean;
  frequency?: 'monthly' | 'yearly' | 'weekly';
}

export type BillSortOrder = 'dueDate' | 'amount' | 'status';
