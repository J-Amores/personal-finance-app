import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchApi } from '@/lib/api-client'
import type { Bill } from '@/lib/db'

export function useBills() {
  return useQuery({
    queryKey: ['bills'],
    queryFn: () => fetchApi<Bill[]>('bills'),
  })
}

export function useCreateBill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newBill: Omit<Bill, 'id'>) =>
      fetchApi<Bill>('bills', {
        method: 'POST',
        body: JSON.stringify(newBill),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] })
    },
  })
}

export function useUpdateBill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bill: Bill) =>
      fetchApi<Bill>('bills', {
        method: 'PUT',
        body: JSON.stringify(bill),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] })
    },
  })
}

export function useDeleteBill() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      fetchApi<void>(`bills?id=${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] })
    },
  })
}

export function useUpcomingBills() {
  const { data: bills = [] } = useBills()
  
  return bills.filter(bill => !bill.isPaid).sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )
}

export function useOverdueBills() {
  const { data: bills = [] } = useBills()
  const now = new Date()
  
  return bills.filter(bill => 
    !bill.isPaid && new Date(bill.dueDate) < now
  ).sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )
}
