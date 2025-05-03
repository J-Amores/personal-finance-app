export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BillSortOrder = 'asc' | 'desc';
