import Database from 'better-sqlite3'
import path from 'path'

// Create a connection to the database
const db = new Database(path.join(process.cwd(), 'src/data/dev.db'))



// Helper functions for database operations
const dbGet = <T>(sql: string, params: any[] = []): T => {
  const stmt = db.prepare(sql)
  return stmt.get(...params) as T
}

const dbAll = <T>(sql: string, params: any[] = []): T[] => {
  const stmt = db.prepare(sql)
  return stmt.all(...params) as T[]
}

const dbRun = (sql: string, params: any[] = []) => {
  const stmt = db.prepare(sql)
  const result = stmt.run(...params)
  return { lastID: result.lastInsertRowid }
}

const beginTransaction = () => db.prepare('BEGIN TRANSACTION').run()
const commitTransaction = () => db.prepare('COMMIT').run()
const rollbackTransaction = () => db.prepare('ROLLBACK').run()

// Type definitions for our data
export interface Transaction {
  id: number
  amount: number
  description: string
  date: string
  type: 'income' | 'expense'
  category: string
}

export interface Budget {
  id: number
  category: string
  amount: number
  spent: number
  period: 'monthly' | 'quarterly' | 'yearly'
}

export interface Bill {
  id: number
  name: string
  amount: number
  dueDate: string
  isPaid: boolean
  category: string
}

export interface Pot {
  id: number
  name: string
  targetAmount: number
  currentAmount: number
  category: string
}

// Helper types for database operations
export type MonthlySpending = Array<{ category: string; total: number }>

export interface Overview {
  currentBalance: number
  totalIncome: number
  totalExpenses: number
}

// Database operations
export const db_operations = {
  // Transactions
  getTransactions(): Transaction[] {
    return dbAll('SELECT * FROM transactions ORDER BY date DESC')
  },

  getTransactionsByCategory(category: string): Transaction[] {
    return dbAll(
      'SELECT * FROM transactions WHERE category = ? ORDER BY date DESC',
      [category]
    )
  },

  getTransactionById(id: number): Transaction | undefined {
    return dbGet('SELECT * FROM transactions WHERE id = ?', [id])
  },

  createTransaction(data: Omit<Transaction, 'id'>): Transaction {
    const { amount, description, date, type, category } = data
    const result = dbRun(
      'INSERT INTO transactions (amount, description, date, type, category) VALUES (?, ?, ?, ?, ?)',
      [amount, description, date, type, category]
    )
    return { id: Number(result.lastID), ...data }
  },

  updateTransaction(id: number, data: Partial<Omit<Transaction, 'id'>>): void {
    const sets = Object.entries(data)
      .map(([key]) => `${key} = ?`)
      .join(', ')
    const values = [...Object.values(data), id]
    
    dbRun(`UPDATE transactions SET ${sets} WHERE id = ?`, values)
  },

  deleteTransaction(id: number): void {
    dbRun('DELETE FROM transactions WHERE id = ?', [id])
  },

  // Budgets
  getBudgets(): Budget[] {
    return dbAll('SELECT * FROM budgets')
  },

  getBudgetByCategory(category: string): Budget | undefined {
    return dbGet(
      'SELECT * FROM budgets WHERE category = ?',
      [category]
    )
  },

  createBudget(data: Omit<Budget, 'id'>): Budget {
    const { category, amount, spent, period } = data
    const result = dbRun(
      'INSERT INTO budgets (category, amount, spent, period) VALUES (?, ?, ?, ?)',
      [category, amount, spent, period]
    )
    return { id: Number(result.lastID), ...data }
  },

  updateBudget(id: number, data: Partial<Omit<Budget, 'id'>>): void {
    const sets = Object.entries(data)
      .map(([key]) => `${key} = ?`)
      .join(', ')
    const values = [...Object.values(data), id]
    
    dbRun(`UPDATE budgets SET ${sets} WHERE id = ?`, values)
  },

  deleteBudget(id: number): void {
    dbRun('DELETE FROM budgets WHERE id = ?', [id])
  },

  getBudgetSpending(budgetId: number): number {
    const budget = dbGet<{ category: string }>('SELECT category FROM budgets WHERE id = ?', [budgetId])
    if (!budget) return 0

    const result = dbGet<{ total: number }>(
      'SELECT SUM(amount) as total FROM transactions WHERE category = ? AND type = "expense"',
      [budget.category]
    )
    return result?.total || 0
  },

  // Bills
  getBills(): Bill[] {
    return dbAll('SELECT * FROM bills ORDER BY dueDate')
  },

  getUpcomingBills(days: number = 7): Bill[] {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return dbAll(
      'SELECT * FROM bills WHERE dueDate <= ? AND isPaid = 0 ORDER BY dueDate',
      [date.toISOString()]
    )
  },

  createBill(data: Omit<Bill, 'id'>): Bill {
    const { name, amount, dueDate, isPaid, category } = data
    const result = dbRun(
      'INSERT INTO bills (name, amount, dueDate, isPaid, category) VALUES (?, ?, ?, ?, ?)',
      [name, amount, dueDate, isPaid, category]
    )
    return { id: Number(result.lastID), ...data }
  },

  updateBill(id: number, data: Partial<Omit<Bill, 'id'>>): void {
    const sets = Object.entries(data)
      .map(([key]) => `${key} = ?`)
      .join(', ')
    const values = [...Object.values(data), id]
    
    dbRun(`UPDATE bills SET ${sets} WHERE id = ?`, values)
  },

  deleteBill(id: number): void {
    dbRun('DELETE FROM bills WHERE id = ?', [id])
  },

  // Pots (Savings goals)
  getPots(): Pot[] {
    return dbAll('SELECT * FROM pots')
  },

  createPot(data: Omit<Pot, 'id'>): Pot {
    const { name, targetAmount, currentAmount, category } = data
    const result = dbRun(
      'INSERT INTO pots (name, targetAmount, currentAmount, category) VALUES (?, ?, ?, ?)',
      [name, targetAmount, currentAmount, category]
    )
    return { id: Number(result.lastID), ...data }
  },

  updatePot(id: number, data: Partial<Omit<Pot, 'id'>>): void {
    const sets = Object.entries(data)
      .map(([key]) => `${key} = ?`)
      .join(', ')
    const values = [...Object.values(data), id]
    
    dbRun(`UPDATE pots SET ${sets} WHERE id = ?`, values)
  },

  deletePot(id: number): void {
    dbRun('DELETE FROM pots WHERE id = ?', [id])
  },

  transferToPot(potId: number, amount: number): void {
    beginTransaction()
    try {
      // Create the transfer transaction
      this.createTransaction({
        amount: -amount,
        type: 'expense',
        category: 'savings',
        description: `Transfer to savings pot ${potId}`,
        date: new Date().toISOString()
      })

      // Update the pot's current amount
      const pot = dbGet<{ currentAmount: number }>('SELECT currentAmount FROM pots WHERE id = ?', [potId])
      if (!pot) throw new Error('Pot not found')

      this.updatePot(potId, {
        currentAmount: pot.currentAmount + amount
      })

      commitTransaction()
    } catch (error) {
      rollbackTransaction()
      throw error
    }
  },

  // Overview and Statistics
  getOverview(): Overview {
    const totalIncome = dbGet<{ total: number }>('SELECT SUM(amount) as total FROM transactions WHERE type = "income"')
    const totalExpenses = dbGet<{ total: number }>('SELECT SUM(amount) as total FROM transactions WHERE type = "expense"')

    return {
      currentBalance: (totalIncome?.total || 0) - (totalExpenses?.total || 0),
      totalIncome: totalIncome?.total || 0,
      totalExpenses: totalExpenses?.total || 0
    }
  },

  getMonthlySpending(month: number, year: number): MonthlySpending {
    const startDate = new Date(year, month - 1, 1).toISOString()
    const endDate = new Date(year, month, 0).toISOString()

    return dbAll(
      'SELECT category, SUM(amount) as total FROM transactions WHERE type = "expense" AND date BETWEEN ? AND ? GROUP BY category',
      [startDate, endDate]
    )
  }
}

// Removed the extra return statement
