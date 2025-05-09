import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const transactions = db.prepare('SELECT * FROM transactions').all();
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = db.prepare(`
      INSERT INTO transactions (description, amount, category, date, type)
      VALUES (@description, @amount, @category, @date, @type)
    `).run(data);
    
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const result = db.prepare(`
      UPDATE transactions 
      SET description = @description, 
          amount = @amount, 
          category = @category, 
          date = @date, 
          type = @type
      WHERE id = @id
    `).run(data);
    
    return NextResponse.json({ success: result.changes > 0 });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const result = db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
    return NextResponse.json({ success: result.changes > 0 });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
