import { Bill } from '@/types/bills'

const STORAGE_KEY = 'recurring-bills'

export function getRecurringBills(): Bill[] {
  try {
    const bills = localStorage.getItem(STORAGE_KEY)
    return bills ? JSON.parse(bills) : []
  } catch {
    return []
  }
}

export function saveRecurringBill(bill: Bill) {
  const bills = getRecurringBills()
  const index = bills.findIndex((b) => b.id === bill.id)

  if (index > -1) {
    bills[index] = bill
  } else {
    bills.push(bill)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(bills))
}

export function deleteRecurringBill(id: string) {
  const bills = getRecurringBills()
  const filteredBills = bills.filter((b) => b.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBills))
}

export function sortRecurringBills(bills: Bill[], sortOrder: 'asc' | 'desc' = 'desc') {
  return [...bills].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime()
    const dateB = new Date(b.dueDate).getTime()
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
  })
}

export function filterRecurringBills(bills: Bill[], query: string) {
  const searchTerm = query.toLowerCase()
  return bills.filter(
    (bill) =>
      bill.name.toLowerCase().includes(searchTerm) ||
      bill.category.toLowerCase().includes(searchTerm)
  )
}

export function getRecurringBillStats() {
  const bills = getRecurringBills()
  const total = bills.reduce((sum, bill) => sum + bill.amount, 0)
  const paid = bills.filter((bill) => bill.status === 'paid')
  const upcoming = bills.filter((bill) => bill.status === 'pending')
  const overdue = bills.filter((bill) => bill.status === 'overdue')

  return {
    total,
    paid: {
      count: paid.length,
      amount: paid.reduce((sum, bill) => sum + bill.amount, 0),
    },
    upcoming: {
      count: upcoming.length,
      amount: upcoming.reduce((sum, bill) => sum + bill.amount, 0),
    },
    overdue: {
      count: overdue.length,
      amount: overdue.reduce((sum, bill) => sum + bill.amount, 0),
    },
  }
}
