import Database from 'better-sqlite3';
import path from 'path';

// Create a test database connection
const testDb = new Database(':memory:'); // Use in-memory database for tests

// Initialize database schema
testDb.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount DECIMAL NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
    category TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT UNIQUE NOT NULL,
    amount DECIMAL NOT NULL,
    spent DECIMAL DEFAULT 0,
    period TEXT CHECK(period IN ('monthly', 'quarterly', 'yearly')) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount DECIMAL NOT NULL,
    dueDate TEXT NOT NULL,
    isPaid BOOLEAN DEFAULT 0,
    category TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS pots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    targetAmount DECIMAL NOT NULL,
    currentAmount DECIMAL DEFAULT 0,
    category TEXT NOT NULL
  );
`);

// Helper functions for database operations
const dbGet = <T>(sql: string, params: any[] = []): T => {
  const stmt = testDb.prepare(sql);
  return stmt.get(...params) as T;
};

const dbAll = <T>(sql: string, params: any[] = []): T[] => {
  const stmt = testDb.prepare(sql);
  return stmt.all(...params) as T[];
};

const dbRun = (sql: string, params: any[] = []) => {
  const stmt = testDb.prepare(sql);
  const result = stmt.run(...params);
  return { lastID: result.lastInsertRowid };
};

// Export test database operations
export const test_db_operations = {
  // Clean up function for tests
  cleanup: () => {
    testDb.exec(`
      DELETE FROM transactions;
      DELETE FROM budgets;
      DELETE FROM bills;
      DELETE FROM pots;
    `);
  },

  // Database operations
  getTransactions: () => dbAll('SELECT * FROM transactions ORDER BY date DESC'),
  
  getTransactionsByCategory: (category: string) => 
    dbAll('SELECT * FROM transactions WHERE category = ? ORDER BY date DESC', [category]),

  createTransaction: (data: Omit<Transaction, 'id'>) => {
    const { amount, description, date, type, category } = data;
    const result = dbRun(
      'INSERT INTO transactions (amount, description, date, type, category) VALUES (?, ?, ?, ?, ?)',
      [amount, description, date, type, category]
    );
    return { id: Number(result.lastID), ...data };
  },

  getBudgets: () => dbAll('SELECT * FROM budgets'),

  getBudgetByCategory: (category: string) =>
    dbGet('SELECT * FROM budgets WHERE category = ?', [category]),

  createBudget: (data: Omit<Budget, 'id'>) => {
    const { category, amount, spent, period } = data;
    const result = dbRun(
      'INSERT INTO budgets (category, amount, spent, period) VALUES (?, ?, ?, ?)',
      [category, amount, spent, period]
    );
    return { id: Number(result.lastID), ...data };
  },

  updateBudget: (id: number, data: Partial<Omit<Budget, 'id'>>) => {
    const sets = Object.entries(data)
      .map(([key]) => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(data), id];
    dbRun(`UPDATE budgets SET ${sets} WHERE id = ?`, values);
  }
};

// Import types
import type { Transaction, Budget, Bill, Pot } from './db';

// Re-export types
export type { Transaction, Budget, Bill, Pot };
