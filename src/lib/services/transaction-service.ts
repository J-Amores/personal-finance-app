import { Transaction } from '@/types';
import * as transactionActions from '@/lib/actions/transactions';

export const transactionService = {
  getAll: async (): Promise<Transaction[]> => {
    return transactionActions.getTransactions();
  },

  getById: async (id: string): Promise<Transaction | undefined> => {
    return transactionActions.getTransactionById(id);
  },

  getByCategory: async () => {
    return transactionActions.getCategoryTotals();
  },

  getMonthlyTotals: async () => {
    return transactionActions.getMonthlyTotals();
  },

  create: async (data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> => {
    return transactionActions.createTransaction(data);
  },

  update: async (id: string, data: Partial<Transaction>): Promise<boolean> => {
    return transactionActions.updateTransaction(id, data);
  },

  delete: async (id: string): Promise<boolean> => {
    return transactionActions.deleteTransaction(id);
  }
};
