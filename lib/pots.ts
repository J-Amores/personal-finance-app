import { Pot, PotSortOrder } from "@/types/pots"

const STORAGE_KEY = "pots"

export function getPots(): Pot[] {
  if (typeof window === "undefined") return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function savePot(pot: Pot): void {
  if (typeof window === "undefined") return
  
  const pots = getPots()
  const index = pots.findIndex((p) => p.id === pot.id)
  
  if (index >= 0) {
    // Update existing pot
    pots[index] = pot
  } else {
    // Add new pot
    pots.push(pot)
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pots))
}

export function deletePot(id: string): void {
  if (typeof window === "undefined") return
  
  const pots = getPots()
  const filtered = pots.filter((p) => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function sortPots(
  pots: Pot[],
  sortOrder: PotSortOrder
): Pot[] {
  return [...pots].sort((a, b) => {
    switch (sortOrder) {
      case "progress":
        return (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount)
      case "amount":
        return b.targetAmount - a.targetAmount
      case "name":
        return a.name.localeCompare(b.name)
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })
}

export function filterPots(
  pots: Pot[],
  query: string
): Pot[] {
  const searchLower = query.toLowerCase()
  return pots.filter((pot) => 
    pot.name.toLowerCase().includes(searchLower) ||
    pot.description?.toLowerCase().includes(searchLower)
  )
}
