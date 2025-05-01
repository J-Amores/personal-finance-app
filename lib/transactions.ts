import { Transaction, Balance } from "@/types/transaction"

const STORAGE_KEY = "transactions"

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function saveTransaction(transaction: Transaction): Transaction {
  if (typeof window === "undefined") throw new Error('Cannot save transaction in server environment');
  
  const transactions = getTransactions();
  const index = transactions.findIndex((t) => t.id === transaction.id);
  
  // Ensure transaction has an ID
  if (!transaction.id) {
    transaction.id = crypto.randomUUID();
  }
  
  // Ensure dates are set
  if (!transaction.createdAt) {
    transaction.createdAt = new Date();
  }
  transaction.updatedAt = new Date();
  
  if (index >= 0) {
    // Update existing transaction
    transactions[index] = transaction;
  } else {
    // Add new transaction
    transactions.unshift(transaction);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  return transaction;
}

export function deleteTransaction(id: string): void {
  if (typeof window === "undefined") return
  
  const transactions = getTransactions()
  const filtered = transactions.filter((t) => t.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

// Helper function to sort transactions
export function sortTransactions(
  transactions: Transaction[],
  sortOrder: "latest" | "oldest" | "highest" | "lowest"
): Transaction[] {
  return [...transactions].sort((a, b) => {
    switch (sortOrder) {
      case "latest":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "highest":
        return b.amount - a.amount
      case "lowest":
        return a.amount - b.amount
      default:
        return 0
    }
  })
}

// Helper function to filter transactions by search query
export function filterTransactions(
  transactions: Transaction[],
  query: string,
  category: string = "all"
): Transaction[] {
  const searchTerm = query.toLowerCase()
  
  return transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm) ||
      transaction.category.toLowerCase().includes(searchTerm)
    
    const matchesCategory =
      category === "all" || transaction.category === category
    
    return matchesSearch && matchesCategory
  })
}

export function getTransactionStats(): Balance {
  const transactions = getTransactions()
  
  const stats = transactions.reduce(
    (acc, transaction) => {
      const amount = transaction.amount
      
      if (transaction.type === 'income') {
        acc.income += amount
        acc.current += amount
      } else {
        acc.expenses += amount
        acc.current -= amount
      }
      
      return acc
    },
    { current: 0, income: 0, expenses: 0 }
  )
  
  return stats
}
