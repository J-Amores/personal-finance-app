import { Budget, BudgetSortOrder } from "@/types/budgets"

const STORAGE_KEY = "budgets"

export function getBudgets(): Budget[] {
  if (typeof window === "undefined") return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function saveBudget(budget: Budget): void {
  if (typeof window === "undefined") return
  
  const budgets = getBudgets()
  const index = budgets.findIndex((b) => b.id === budget.id)
  
  if (index >= 0) {
    // Update existing budget
    budgets[index] = budget
  } else {
    // Add new budget
    budgets.push(budget)
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets))
}

export function deleteBudget(id: string): void {
  if (typeof window === "undefined") return
  
  const budgets = getBudgets()
  const filtered = budgets.filter((b) => b.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function sortBudgets(
  budgets: Budget[],
  sortOrder: BudgetSortOrder
): Budget[] {
  return [...budgets].sort((a, b) => {
    switch (sortOrder) {
      case "overspent":
        return (b.spent - b.amount) - (a.spent - a.amount)
      case "progress":
        return (b.spent / b.amount) - (a.spent / a.amount)
      case "alphabetical":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })
}

export function filterBudgets(
  budgets: Budget[],
  query: string,
  category: string = "all"
): Budget[] {
  const searchLower = query.toLowerCase()
  return budgets.filter((budget) => {
    const matchesSearch =
      budget.name.toLowerCase().includes(searchLower) ||
      budget.category.toLowerCase().includes(searchLower)
      
    const matchesCategory = 
      category === "all" || budget.category === category
      
    return matchesSearch && matchesCategory
  })
}
