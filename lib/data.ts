import data from '@/data.json';

import { Transaction } from '@/types/transaction';

// Extend Transaction for internal use
interface InternalTransaction extends Omit<Transaction, 'id'> {
  recurring: boolean;
}

export type Budget = {
  category: string;
  maximum: number;
  theme: string;
}

export interface Balance {
  current: number;
  income: number;
  expenses: number;
}

export function getBalance(): Balance {
  return data.balance;
}

export function getTransactions(): Transaction[] {
  // Add IDs to transactions
  return data.transactions.map((t: InternalTransaction, index: number) => ({
    ...t,
    id: `t-${index}`,
    recurring: t.recurring || false
  }));
}

export function getBudgets(): Budget[] {
  return data.budgets;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
