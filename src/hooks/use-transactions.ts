import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '@/lib/services/transaction-service';
import { Transaction } from '@/types';

export function useTransactions() {
  const queryClient = useQueryClient();

  const transactions = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getAll()
  });

  const monthlyTotals = useQuery({
    queryKey: ['transactions', 'monthly'],
    queryFn: () => transactionService.getMonthlyTotals()
  });

  const categoryTotals = useQuery({
    queryKey: ['transactions', 'category'],
    queryFn: () => transactionService.getByCategory()
  });

  const createTransaction = useMutation({
    mutationFn: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) =>
      transactionService.create(transaction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  const updateTransaction = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
      transactionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  const deleteTransaction = useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    }
  });

  return {
    transactions,
    monthlyTotals,
    categoryTotals,
    createTransaction,
    updateTransaction,
    deleteTransaction
  };
}
