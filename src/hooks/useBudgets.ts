import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchApi } from '@/lib/api-client'
import type { Budget } from '@/lib/db'

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: () => fetchApi<Budget[]>('budgets'),
  })
}

export function useCreateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newBudget: Omit<Budget, 'id'>) =>
      fetchApi<Budget>('budgets', {
        method: 'POST',
        body: JSON.stringify(newBudget),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export function useUpdateBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (budget: Budget) =>
      fetchApi<Budget>('budgets', {
        method: 'PUT',
        body: JSON.stringify(budget),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export function useDeleteBudget() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      fetchApi<void>(`budgets?id=${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export function useBudgetProgress(budgetId: number) {
  const { data: budgets = [] } = useBudgets()
  const budget = budgets.find(b => b.id === budgetId)
  
  if (!budget) return 0
  return (budget.spent / budget.amount) * 100
}
