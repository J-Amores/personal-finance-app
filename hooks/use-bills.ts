import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Bill } from '@/types/bills';
import type { BillFormValues } from '@/lib/validations/bill';
import { getBills, createBill, updateBill, deleteBill } from '@/app/actions/bills';

interface BillFilters {
  query?: string;
  category?: string;
  status?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useBills() {
  return useQuery({
    queryKey: ['bills'],
    queryFn: () => getBills(),
  });
}

export function useCreateBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BillFormValues) => {
      const billData = {
        ...data,
        dueDate: data.dueDate.toISOString(),
      };
      return createBill(billData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
}

export function useUpdateBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BillFormValues }) => {
      const billData = {
        ...data,
        dueDate: data.dueDate.toISOString(),
      };
      return updateBill(id, billData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
}

export function useDeleteBill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
    },
  });
}
