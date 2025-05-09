'use server';

import fs from 'fs';
import path from 'path';
import { Transaction } from '@/types';

const DATA_PATH = path.join(process.cwd(), 'src', 'data', 'data.json');

type DataJson = {
  transactions: Array<{
    name: string;
    category: string;
    amount: number;
    type: 'income' | 'expense';
    recurring: boolean;
    date: string;
  }>;
};

function readData(): DataJson {
  const rawData = fs.readFileSync(DATA_PATH, 'utf8');
  return JSON.parse(rawData);
}

export async function getTransactions(): Promise<Transaction[]> {
  const data = readData();
  return data.transactions.map(t => ({
    id: Buffer.from(t.name + t.date).toString('base64'),
    description: t.name,
    amount: t.amount,
    category: t.category,
    date: new Date(t.date).toISOString(),
    type: t.type,
    createdAt: new Date(t.date).toISOString(),
    updatedAt: new Date(t.date).toISOString()
  }));
}

export async function getTransactionById(id: string): Promise<Transaction | undefined> {
  const transactions = await getTransactions();
  return transactions.find(t => t.id === id);
}

export async function getCategoryTotals() {
  const transactions = await getTransactions();
  const totals = new Map<string, { income: number; expense: number }>();
  
  for (const t of transactions) {
    const current = totals.get(t.category) || { income: 0, expense: 0 };
    current[t.type] += t.amount;
    totals.set(t.category, current);
  }
  
  return Array.from(totals.entries()).map(([category, amounts]) => ({
    category,
    income: amounts.income,
    expense: amounts.expense
  }));
}

export async function getMonthlyTotals() {
  const transactions = await getTransactions();
  const totals = new Map<string, { income: number; expense: number }>();
  
  for (const t of transactions) {
    const month = t.date.substring(0, 7); // YYYY-MM
    const current = totals.get(month) || { income: 0, expense: 0 };
    current[t.type] += t.amount;
    totals.set(month, current);
  }
  
  return Array.from(totals.entries())
    .map(([month, amounts]) => ({
      month,
      income: amounts.income,
      expense: amounts.expense
    }))
    .sort((a, b) => b.month.localeCompare(a.month));
}

// Note: These mutations won't persist since we're using a static JSON file
export async function createTransaction(): Promise<number> {
  return 0;
}

export async function updateTransaction(): Promise<boolean> {
  return false;
}

export async function deleteTransaction(): Promise<boolean> {
  return false;
}
