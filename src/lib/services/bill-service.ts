import { Bill } from '@/types';
import db from '@/lib/db';

export const billService = {
  getAll: async (): Promise<Bill[]> => {
    return db.prepare('SELECT * FROM Bill ORDER BY dueDate ASC').all() as Bill[];
  },

  getById: async (id: string): Promise<Bill | undefined> => {
    return db.prepare('SELECT * FROM Bill WHERE id = ?').get(id) as Bill | undefined;
  },

  create: async (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bill> => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const { lastInsertRowid } = db.prepare(`
      INSERT INTO Bill (
        id, name, amount, dueDate, category, frequency,
        isPaid, automaticPayment, notes, createdAt, updatedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      bill.name,
      bill.amount,
      bill.dueDate,
      bill.category,
      bill.frequency,
      bill.isPaid,
      bill.automaticPayment,
      bill.notes,
      now,
      now
    );

    return db.prepare('SELECT * FROM Bill WHERE id = ?').get(id) as Bill;
  },

  update: async (id: string, bill: Partial<Bill>): Promise<Bill | undefined> => {
    const now = new Date().toISOString();
    const current = db.prepare('SELECT * FROM Bill WHERE id = ?').get(id) as Bill;
    
    if (!current) return undefined;

    const updated = { ...current, ...bill, updatedAt: now };
    
    db.prepare(`
      UPDATE Bill 
      SET name = ?, amount = ?, dueDate = ?, category = ?,
          frequency = ?, isPaid = ?, automaticPayment = ?,
          notes = ?, updatedAt = ?
      WHERE id = ?
    `).run(
      updated.name,
      updated.amount,
      updated.dueDate,
      updated.category,
      updated.frequency,
      updated.isPaid,
      updated.automaticPayment,
      updated.notes,
      updated.updatedAt,
      id
    );

    return db.prepare('SELECT * FROM Bill WHERE id = ?').get(id) as Bill;
  },

  delete: async (id: string): Promise<void> => {
    db.prepare('DELETE FROM Bill WHERE id = ?').run(id);
  },

  getUpcoming: async () => {
    const now = new Date().toISOString();
    return db.prepare(`
      SELECT *
      FROM Bill
      WHERE dueDate >= ?
      ORDER BY dueDate ASC
      LIMIT 5
    `).all(now);
  },

  getByStatus: async () => {
    return db.prepare(`
      SELECT 
        category,
        COUNT(*) as total,
        SUM(CASE WHEN isPaid THEN 1 ELSE 0 END) as paid,
        SUM(amount) as totalAmount,
        SUM(CASE WHEN isPaid THEN amount ELSE 0 END) as paidAmount
      FROM Bill
      GROUP BY category
    `).all();
  }
};
