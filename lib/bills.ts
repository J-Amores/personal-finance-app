import { Bill, BillSortOrder } from "@/types/bills"
import { isAfter, isBefore, parseISO } from "date-fns"

const STORAGE_KEY = "bills"

export function getBills(): Bill[] {
  if (typeof window === "undefined") return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function saveBill(bill: Bill): void {
  if (typeof window === "undefined") return
  
  const bills = getBills()
  const index = bills.findIndex((b) => b.id === bill.id)
  
  if (index >= 0) {
    // Update existing bill
    bills[index] = bill
  } else {
    // Add new bill
    bills.push(bill)
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bills))
}

export function deleteBill(id: string): void {
  if (typeof window === "undefined") return
  
  const bills = getBills()
  const filtered = bills.filter((b) => b.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function sortBills(
  bills: Bill[],
  sortOrder: BillSortOrder
): Bill[] {
  return [...bills].sort((a, b) => {
    switch (sortOrder) {
      case "dueDate":
        return parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime()
      case "amount":
        return b.amount - a.amount
      case "status":
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })
}

export function filterBills(
  bills: Bill[],
  query: string,
  status: string = "all",
  category: string = "all"
): Bill[] {
  const searchLower = query.toLowerCase()
  return bills.filter((bill) => {
    const matchesSearch =
      bill.name.toLowerCase().includes(searchLower) ||
      bill.category.toLowerCase().includes(searchLower)
      
    const matchesStatus = 
      status === "all" || bill.status === status
      
    const matchesCategory = 
      category === "all" || bill.category === category
      
    return matchesSearch && matchesStatus && matchesCategory
  })
}

export function updateBillStatuses(bills: Bill[]): Bill[] {
  const today = new Date()
  
  return bills.map(bill => {
    const dueDate = parseISO(bill.dueDate)
    
    if (bill.status === 'paid') {
      return bill
    }
    
    if (isBefore(dueDate, today)) {
      return { ...bill, status: 'overdue' }
    }
    
    return { ...bill, status: 'pending' }
  })
}
