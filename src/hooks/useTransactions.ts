import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchApi } from '@/lib/api-client'
import type { Transaction } from '@/lib/db'

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => fetchApi<Transaction[]>('transactions'),
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newTransaction: Omit<Transaction, 'id'>) =>
      fetchApi<Transaction>('transactions', {
        method: 'POST',
        body: JSON.stringify(newTransaction),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (transaction: Transaction) =>
      fetchApi<Transaction>('transactions', {
        method: 'PUT',
        body: JSON.stringify(transaction),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      fetchApi<void>(`transactions?id=${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}
