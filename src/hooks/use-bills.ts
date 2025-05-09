import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { billService } from '@/lib/services/bill-service';
import { Bill } from '@/types';

export function useBills() {
  const queryClient = useQueryClient();

  const bills = useQuery({
    queryKey: ['bills'],
    queryFn: () => billService.getAll()
  });

  const upcoming = useQuery({
    queryKey: ['bills', 'upcoming'],
    queryFn: () => billService.getUpcoming()
  });

  const status = useQuery({
    queryKey: ['bills', 'status'],
    queryFn: () => billService.getByStatus()
  });

  const createBill = useMutation({
    mutationFn: (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>) =>
      billService.create(bill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    }
  });

  const updateBill = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Bill> }) =>
      billService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    }
  });

  const deleteBill = useMutation({
    mutationFn: (id: string) => billService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    }
  });

  return {
    bills,
    upcoming,
    status,
    createBill,
    updateBill,
    deleteBill
  };
}
