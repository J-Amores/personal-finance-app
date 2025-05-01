'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Budget } from '@/types/budget'

type BudgetCreateInput = {
  category: string
  amount: number
  period: 'monthly' | 'yearly'
  color: string
}

type BudgetUpdateInput = Partial<BudgetCreateInput>

export async function getBudgets() {
  try {
    const budgets = await prisma.budget.findMany()
    
    // Calculate spent amounts for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const spent = await calculateBudgetSpent(budget.category)
        return {
          ...budget,
          spent,
          period: budget.period as 'monthly' | 'yearly',
          color: budget.theme,
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
    const result = await prisma.transaction.aggregate({
      where: {
        category,
        amount: { lt: 0 }, // Only count negative amounts (expenses)
      },
      _sum: {
        amount: true,
      },
    })
    
    return Math.abs(result._sum.amount || 0)
  } catch (error) {
    console.error('Error calculating budget spent:', error)
    return 0
  }
}

export async function createBudget(data: BudgetCreateInput) {
  try {
    const budget = await prisma.budget.create({
      data: {
        category: data.category,
        amount: data.amount,
        period: data.period,
        theme: data.color,
        spent: 0,
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
    const budget = await prisma.budget.update({
      where: { id },
      data: {
        category: data.category,
        amount: data.amount,
        period: data.period,
        theme: data.color,
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
    await prisma.budget.delete({
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
    const budgets = await prisma.budget.findMany()
    
    await Promise.all(
      budgets.map(async (budget) => {
        const spent = await calculateBudgetSpent(budget.category)
        await prisma.budget.update({
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
