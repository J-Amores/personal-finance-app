import { Budget } from '@/types/budget';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export class BudgetServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BudgetServiceError';
  }
}

export type Period = 'monthly' | 'quarterly' | 'yearly';

export type CreateBudgetData = {
  name: string;
  category: string;
  amount: number;
  period: Period;
  startDate: string;
  endDate?: string;
  notes?: string;
  isRecurring: boolean;
  alerts: {
    enabled: boolean;
    threshold?: number;
  };
};

export type UpdateBudgetData = Partial<CreateBudgetData>;

export const budgetService = {
  async getBudgets(): Promise<Budget[]> {
    try {
      const budgets = await db.budget.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });

      return budgets.map(budget => ({
        ...budget,
        period: budget.period as Budget['period'],
        endDate: budget.endDate || undefined,
        notes: budget.notes || undefined,
        alerts: budget.alerts as Budget['alerts'],
        startDate: budget.startDate,
        createdAt: budget.createdAt.toISOString(),
        updatedAt: budget.updatedAt.toISOString(),
      }));
    } catch (error) {
      throw new BudgetServiceError('Failed to fetch budgets');
    }
  },

  async createBudget(data: CreateBudgetData): Promise<Budget> {
    try {
      const budget = await db.budget.create({
        data: {
          ...data,
          spent: 0,
          alerts: data.alerts as Prisma.InputJsonValue,
        },
      });
      
      return {
        ...budget,
        period: budget.period as Budget['period'],
        endDate: budget.endDate || undefined,
        notes: budget.notes || undefined,
        alerts: budget.alerts as Budget['alerts'],
        startDate: budget.startDate,
        createdAt: budget.createdAt.toISOString(),
        updatedAt: budget.updatedAt.toISOString(),
      };
    } catch (error) {
      throw new BudgetServiceError('Failed to create budget');
    }
  },

  async updateBudget(id: string, data: UpdateBudgetData): Promise<Budget> {
    try {
      const budget = await db.budget.update({
        where: { id },
        data: {
          ...data,
          alerts: data.alerts as Prisma.InputJsonValue,
        },
      });

      return {
        ...budget,
        period: budget.period as Budget['period'],
        endDate: budget.endDate || undefined,
        notes: budget.notes || undefined,
        alerts: budget.alerts as Budget['alerts'],
        startDate: budget.startDate,
        createdAt: budget.createdAt.toISOString(),
        updatedAt: budget.updatedAt.toISOString(),
      };
    } catch (error) {
      throw new BudgetServiceError(error instanceof Error ? error.message : 'Failed to update budget');
    }
  },

  async deleteBudget(id: string): Promise<void> {
    try {
      await db.budget.delete({
        where: { id },
      });
    } catch (error) {
      throw new BudgetServiceError(error instanceof Error ? error.message : 'Failed to delete budget');
    }
  },

  async adjustBudgetAmount(id: string, amount: number, action: 'add' | 'withdraw'): Promise<Budget> {
    try {
      const budget = await db.budget.findUnique({
        where: { id },
      });

      if (!budget) {
        throw new BudgetServiceError('Budget not found');
      }

      const updatedSpent = action === 'add'
        ? budget.spent + amount
        : budget.spent - amount;

      if (updatedSpent < 0) {
        throw new BudgetServiceError('Cannot withdraw more than spent amount');
      }

      const updatedBudget = await db.budget.update({
        where: { id },
        data: {
          spent: updatedSpent,
        },
      });

      return {
        ...updatedBudget,
        period: updatedBudget.period as Budget['period'],
        endDate: updatedBudget.endDate || undefined,
        notes: updatedBudget.notes || undefined,
        alerts: updatedBudget.alerts as Budget['alerts'],
        startDate: updatedBudget.startDate,
        createdAt: updatedBudget.createdAt.toISOString(),
        updatedAt: updatedBudget.updatedAt.toISOString(),
      };
    } catch (error) {
      if (error instanceof BudgetServiceError) {
        throw error;
      }
      throw new BudgetServiceError(error instanceof Error ? error.message : 'Failed to adjust budget amount');
    }
  }
};
