import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { potService } from '@/lib/services/pot-service';
import { Pot } from '@/types';

export function usePots() {
  const queryClient = useQueryClient();

  const pots = useQuery({
    queryKey: ['pots'],
    queryFn: () => potService.getAll()
  });

  const progress = useQuery({
    queryKey: ['pots', 'progress'],
    queryFn: () => potService.getProgress()
  });

  const createPot = useMutation({
    mutationFn: (pot: Omit<Pot, 'id' | 'createdAt' | 'updatedAt'>) =>
      potService.create(pot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pots'] });
    }
  });

  const updatePot = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Pot> }) =>
      potService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pots'] });
    }
  });

  const deletePot = useMutation({
    mutationFn: (id: string) => potService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pots'] });
    }
  });

  return {
    pots,
    progress,
    createPot,
    updatePot,
    deletePot
  };
}
