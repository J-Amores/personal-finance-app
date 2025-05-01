'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Transaction } from '@/types/transaction'
import { updateBudgetSpending } from './budgets'

type TransactionInput = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>

export async function getTransactions(query?: string, category?: string, sortOrder: string = 'latest') {
  try {
    const where = {
      ...(query && {
        OR: [
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
      }),
      ...(category && { category }),
    }

    const orderBy = {
      date: sortOrder === 'oldest' ? 'asc' : 'desc',
      amount: sortOrder === 'highest' ? 'desc' : sortOrder === 'lowest' ? 'asc' : undefined,
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: Object.fromEntries(
        Object.entries(orderBy).filter(([_, value]) => value !== undefined)
      ),
    })

    // Convert the raw database records to our Transaction type
    const typedTransactions: Transaction[] = transactions.map(t => ({
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
    const transaction = await prisma.transaction.create({
      data: {
        ...data,
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
    const transaction = await prisma.transaction.update({
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
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    })

    await prisma.transaction.delete({
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
