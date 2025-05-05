'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Transaction } from '@/types/transaction'
import { updateBudgetSpending } from './budgets'

type TransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>

interface TransactionFilters {
  query?: string;
  category?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getTransactions(filters: TransactionFilters = {}) {
  try {
    const where = {
      AND: [
        // Search query filter
        filters.query ? {
          description: { contains: filters.query }
        } : {},
        // Category filter
        filters.category && filters.category !== 'all' ? { category: filters.category } : {},
      ].filter(condition => Object.keys(condition).length > 0),
    }

    const orderBy = {
      date: filters.sortOrder,
    }

    const transactions = await db.transaction.findMany({
      where,
      orderBy: Object.fromEntries(
        Object.entries(orderBy).filter(([_, value]) => value !== undefined)
      ),
    })

    // Convert the raw database records to our Transaction type
    const typedTransactions: Transaction[] = transactions.map((t: any) => ({
      ...t,
      type: t.type as 'income' | 'expense', // Ensure type is correct
    }))

    return { data: typedTransactions }
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return { error: 'Failed to fetch transactions' }
  }
}

export async function createTransaction(data: TransactionInput) {
  try {
    const transaction = await db.transaction.create({
      data: {
        ...data,
        // Ensure date is a proper Date object
        date: new Date(data.date),
        type: data.type, // Prisma will validate this matches the schema
      },
    })

    // Update budget spending when a transaction is created
    if (data.type === 'expense') {
      await updateBudgetSpending()
    }

    revalidatePath('/transactions')
    revalidatePath('/budgets')
    return { data: transaction }
  } catch (error) {
    console.error('Error creating transaction:', error)
    return { error: 'Failed to create transaction' }
  }
}

export async function updateTransaction(id: string, data: TransactionInput) {
  try {
    const transaction = await db.transaction.update({
      where: { id },
      data: {
        ...data,
        type: data.type,
      },
    })

    // Update budget spending when a transaction is updated
    await updateBudgetSpending()

    revalidatePath('/transactions')
    revalidatePath('/budgets')
    return { data: transaction }
  } catch (error) {
    console.error('Error updating transaction:', error)
    return { error: 'Failed to update transaction' }
  }
}

export async function deleteTransaction(id: string) {
  try {
    const transaction: Transaction | null = await db.transaction.findUnique({
      where: { id },
    })

    await db.transaction.delete({
      where: { id },
    })

    // Update budget spending when a transaction is deleted
    if (transaction?.type === 'expense') {
      await updateBudgetSpending()
    }

    revalidatePath('/transactions')
    revalidatePath('/budgets')
    return { success: true }
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return { error: 'Failed to delete transaction' }
  }
}
