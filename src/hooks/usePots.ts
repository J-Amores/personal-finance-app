import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchApi } from '@/lib/api-client'
import type { Pot } from '@/lib/db'

export function usePots() {
  return useQuery({
    queryKey: ['pots'],
    queryFn: () => fetchApi<Pot[]>('pots'),
  })
}

export function useCreatePot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newPot: Omit<Pot, 'id'>) =>
      fetchApi<Pot>('pots', {
        method: 'POST',
        body: JSON.stringify(newPot),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pots'] })
    },
  })
}

export function useUpdatePot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (pot: Pot) =>
      fetchApi<Pot>('pots', {
        method: 'PUT',
        body: JSON.stringify(pot),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pots'] })
    },
  })
}

export function useDeletePot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) =>
      fetchApi<void>(`pots?id=${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pots'] })
    },
  })
}

export function usePotProgress(potId: number) {
  const { data: pots = [] } = usePots()
  const pot = pots.find(p => p.id === potId)
  
  if (!pot) return 0
  return (pot.currentAmount / pot.targetAmount) * 100
}

export function useCompletedPots() {
  const { data: pots = [] } = usePots()
  return pots.filter(pot => pot.currentAmount >= pot.targetAmount)
}
