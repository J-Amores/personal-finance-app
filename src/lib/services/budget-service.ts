import { Budget } from '@/types';
import db from '@/lib/db';

export const budgetService = {
  getAll: async (): Promise<Budget[]> => {
    return db.prepare('SELECT * FROM Budget ORDER BY createdAt DESC').all() as Budget[];
  },

  getById: async (id: string): Promise<Budget | undefined> => {
    return db.prepare('SELECT * FROM Budget WHERE id = ?').get(id) as Budget | undefined;
  },

  create: async (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const { lastInsertRowid } = db.prepare(`
      INSERT INTO Budget (
        id, name, category, amount, spent, period, 
        startDate, endDate, notes, isRecurring, alerts,
        createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      budget.name,
      budget.category,
      budget.amount,
      budget.spent,
      budget.period,
      budget.startDate,
      budget.endDate,
      budget.notes,
      budget.isRecurring,
      JSON.stringify(budget.alerts),
      now,
      now
    );

    return db.prepare('SELECT * FROM Budget WHERE id = ?').get(id) as Budget;
  },

  update: async (id: string, budget: Partial<Budget>): Promise<Budget | undefined> => {
    const now = new Date().toISOString();
    const current = db.prepare('SELECT * FROM Budget WHERE id = ?').get(id) as Budget;
    
    if (!current) return undefined;

    const updated = { ...current, ...budget, updatedAt: now };
    
    db.prepare(`
      UPDATE Budget 
      SET name = ?, category = ?, amount = ?, spent = ?, 
          period = ?, startDate = ?, endDate = ?, notes = ?,
          isRecurring = ?, alerts = ?, updatedAt = ?
      WHERE id = ?
    `).run(
      updated.name,
      updated.category,
      updated.amount,
      updated.spent,
      updated.period,
      updated.startDate,
      updated.endDate,
      updated.notes,
      updated.isRecurring,
      JSON.stringify(updated.alerts),
      updated.updatedAt,
      id
    );

    return db.prepare('SELECT * FROM Budget WHERE id = ?').get(id) as Budget;
  },

  delete: async (id: string): Promise<void> => {
    db.prepare('DELETE FROM Budget WHERE id = ?').run(id);
  },

  getProgress: async () => {
    return db.prepare(`
      SELECT 
        category,
        amount,
        spent,
        ROUND((spent * 100.0 / amount), 2) as percentage
      FROM Budget
      WHERE period = 'monthly'
      ORDER BY percentage DESC
    `).all();
  }
};
