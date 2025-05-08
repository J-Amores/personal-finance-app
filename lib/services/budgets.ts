import { db } from '@/lib/db';

export type BudgetProgress = {
  category: string;
  spent: number;
  limit: number;
  percentage: number;
};

export async function getBudgetProgress(): Promise<BudgetProgress[]> {
  const budgets = await db.budget.findMany({
    select: {
      category: true,
      amount: true,
      spent: true,
    },
    where: {
      // Only show active budgets
      OR: [
        { endDate: null },
        { endDate: { gt: new Date().toISOString() } }
      ],
      startDate: { lte: new Date().toISOString() }
    }
  });

  return budgets.map(budget => ({
    category: budget.category,
    spent: Number(budget.spent),
    limit: Number(budget.amount),
    percentage: Math.round((Number(budget.spent) / Number(budget.amount)) * 100)
  }));
}
