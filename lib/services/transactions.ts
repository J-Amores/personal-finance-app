import { db } from '@/lib/db';
import { TransactionType } from '@prisma/client';

export type MonthlyData = {
  month: string;
  income: number;
  expenses: number;
};

export async function getTransactionsByMonth(): Promise<MonthlyData[]> {
  // Fetch all transactions
  const transactions = await db.transaction.findMany({
    select: {
      amount: true,
      type: true,
      createdAt: true
    },
    where: {
      type: {
        in: [TransactionType.income, TransactionType.expense]
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  // Group transactions by month
  const monthlyData = transactions.reduce<MonthlyData[]>((acc, t) => {
    const date = new Date(t.createdAt);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    const existingMonth = acc.find(m => m.month === monthYear);
    if (existingMonth) {
      if (t.type === TransactionType.income) {
        existingMonth.income += Number(t.amount);
      } else {
        existingMonth.expenses += Number(t.amount);
      }
    } else {
      acc.push({
        month: monthYear,
        income: t.type === TransactionType.income ? Number(t.amount) : 0,
        expenses: t.type === TransactionType.expense ? Number(t.amount) : 0,
      });
    }
    return acc;
  }, []);

  return monthlyData.sort((a, b) => {
    const [aMonth, aYear] = a.month.split('/');
    const [bMonth, bYear] = b.month.split('/');
    return Number(aYear) - Number(bYear) || Number(aMonth) - Number(bMonth);
  });


  return monthlyData;
}
