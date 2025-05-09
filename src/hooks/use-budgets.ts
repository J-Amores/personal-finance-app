import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '@/lib/services/budget-service';
import { Budget } from '@/types';

export function useBudgets() {
  const queryClient = useQueryClient();

  const budgets = useQuery({
    queryKey: ['budgets'],
    queryFn: () => budgetService.getAll()
  });

  const progress = useQuery({
    queryKey: ['budgets', 'progress'],
    queryFn: () => budgetService.getProgress()
  });

  const createBudget = useMutation({
    mutationFn: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) =>
      budgetService.create(budget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    }
  });

  const updateBudget = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Budget> }) =>
      budgetService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    }
  });

  const deleteBudget = useMutation({
    mutationFn: (id: string) => budgetService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    }
  });

  return {
    budgets,
    progress,
    createBudget,
    updateBudget,
    deleteBudget
  };
}
