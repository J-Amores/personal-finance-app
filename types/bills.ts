export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  frequency: 'monthly' | 'weekly' | 'yearly' | 'once';
  status: 'paid' | 'pending' | 'overdue';
  notes?: string;
  automaticPayment: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BillSortOrder = 'asc' | 'desc';
