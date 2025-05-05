import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Budget } from '@/types/budget';
import type { BudgetFormValues } from '@/lib/validations/budget';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '@/app/actions/budgets';

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: () => getBudgets(),
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BudgetFormValues) => {
      const budgetData = {
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate?.toISOString(),
      };
      return createBudget(budgetData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BudgetFormValues }) => {
      const budgetData = {
        ...data,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate?.toISOString(),
      };
      return updateBudget(id, budgetData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
}
