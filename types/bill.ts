export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  status: 'paid' | 'pending' | 'overdue';
  frequency: 'monthly' | 'weekly' | 'yearly' | 'quarterly';
  automaticPayment: boolean;
  paymentMethod?: string;
  notes?: string;
}

export type BillSortOrder = 'dueDate-asc' | 'dueDate-desc' | 'amount-asc' | 'amount-desc';

export interface BillFilters {
  status?: string;
  category?: string;
  frequency?: string;
  automaticPayment?: boolean;
}
