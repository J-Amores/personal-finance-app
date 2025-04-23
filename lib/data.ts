import data from '@/data.json';

export interface Transaction {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
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
  return data.transactions;
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
