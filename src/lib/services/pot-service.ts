import { Pot } from '@/types';
import db from '@/lib/db';

export const potService = {
  getAll: async (): Promise<Pot[]> => {
    return db.prepare('SELECT * FROM Pot ORDER BY createdAt DESC').all() as Pot[];
  },

  getById: async (id: string): Promise<Pot | undefined> => {
    return db.prepare('SELECT * FROM Pot WHERE id = ?').get(id) as Pot | undefined;
  },

  create: async (pot: Omit<Pot, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pot> => {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const { lastInsertRowid } = db.prepare(`
      INSERT INTO Pot (id, name, target, total, theme, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, pot.name, pot.target, pot.total, pot.theme, now, now);

    return db.prepare('SELECT * FROM Pot WHERE id = ?').get(id) as Pot;
  },

  update: async (id: string, pot: Partial<Pot>): Promise<Pot | undefined> => {
    const now = new Date().toISOString();
    const current = db.prepare('SELECT * FROM Pot WHERE id = ?').get(id) as Pot;
    
    if (!current) return undefined;

    const updated = { ...current, ...pot, updatedAt: now };
    
    db.prepare(`
      UPDATE Pot 
      SET name = ?, target = ?, total = ?, theme = ?, updatedAt = ?
      WHERE id = ?
    `).run(
      updated.name,
      updated.target,
      updated.total,
      updated.theme,
      updated.updatedAt,
      id
    );

    return db.prepare('SELECT * FROM Pot WHERE id = ?').get(id) as Pot;
  },

  delete: async (id: string): Promise<void> => {
    db.prepare('DELETE FROM Pot WHERE id = ?').run(id);
  },

  getProgress: async () => {
    return db.prepare(`
      SELECT 
        name,
        target,
        total,
        ROUND((total * 100.0 / target), 2) as percentage
      FROM Pot
      ORDER BY percentage DESC
    `).all();
  }
};
