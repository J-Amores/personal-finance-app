'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Budget } from '@/types/budget'
import { Prisma } from '@prisma/client'

type AlertsType = {
  enabled: boolean
  threshold?: number
}

type BudgetBaseInput = {
  name: string
  category: string
  amount: number
  spent?: number
  period: 'monthly' | 'yearly' | 'quarterly'
  startDate: string
  endDate?: string
  notes?: string
  isRecurring?: boolean
  alerts: AlertsType
}

type BudgetCreateInput = BudgetBaseInput

type BudgetUpdateInput = Partial<BudgetBaseInput>

export async function getBudgets() {
  try {
    const budgets = await db.budget.findMany()
    
    // Calculate spent amounts for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget: any) => {
        const spent = await calculateBudgetSpent(budget.category)
        return {
          ...budget,
          spent,
          period: budget.period as 'monthly' | 'yearly' | 'quarterly',
          alerts: JSON.parse(budget.alerts)
        }
      })
    )

    return { data: budgetsWithSpent as Budget[] }
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return { error: 'Failed to fetch budgets' }
  }
}

export async function calculateBudgetSpent(category: string) {
  try {
    const transactions = await db.transaction.findMany({
      where: {
        category,
        amount: { lt: 0 }, // Only count negative amounts (expenses)
      },
      select: {
        amount: true
      }
    })

    const total = transactions.reduce((sum: number, t: { amount: number }) => sum + t.amount, 0)
    return Math.abs(total)
  } catch (error) {
    console.error('Error calculating budget spent:', error)
    return 0
  }
}

export async function createBudget(data: BudgetCreateInput) {
  try {
    const budget = await db.budget.create({
      data: {
        name: data.name,
        category: data.category,
        amount: data.amount,
        period: data.period,
        startDate: data.startDate,
        endDate: data.endDate,
        notes: data.notes,
        isRecurring: data.isRecurring,
        alerts: JSON.stringify(data.alerts),
        spent: 0
      },
    })

    revalidatePath('/budgets')
    return { data: budget }
  } catch (error) {
    console.error('Error creating budget:', error)
    return { error: 'Failed to create budget' }
  }
}

export async function updateBudget(id: string, data: BudgetUpdateInput) {
  try {
    const budget = await db.budget.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.category && { category: data.category }),
        ...(data.amount && { amount: data.amount }),
        ...(data.period && { period: data.period }),
        ...(data.startDate && { startDate: data.startDate }),
        ...(data.endDate && { endDate: data.endDate }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.isRecurring !== undefined && { isRecurring: data.isRecurring }),
        ...(data.alerts && { alerts: JSON.stringify(data.alerts) })
      },
    })

    revalidatePath('/budgets')
    return { data: budget }
  } catch (error) {
    console.error('Error updating budget:', error)
    return { error: 'Failed to update budget' }
  }
}

export async function deleteBudget(id: string) {
  try {
    await db.budget.delete({
      where: { id },
    })

    revalidatePath('/budgets')
    return { success: true }
  } catch (error) {
    console.error('Error deleting budget:', error)
    return { error: 'Failed to delete budget' }
  }
}

// Update all budgets' spent amounts
export async function updateBudgetSpending() {
  try {
    const budgets = await db.budget.findMany()
    
    await Promise.all(
      budgets.map(async (budget: any) => {
        const spent = await calculateBudgetSpent(budget.category)
        await db.budget.update({
          where: { id: budget.id },
          data: { spent },
        })
      })
    )

    revalidatePath('/budgets')
    return { success: true }
  } catch (error) {
    console.error('Error updating budget spending:', error)
    return { error: 'Failed to update budget spending' }
  }
}
