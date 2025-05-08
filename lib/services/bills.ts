import { db } from '@/lib/db';

export type UpcomingBill = {
  name: string;
  amount: number;
  dueDate: string;
  daysUntilDue: number;
  category: string;
  status: 'overdue' | 'due-soon' | 'upcoming';
};

export async function getUpcomingBills(): Promise<UpcomingBill[]> {
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const bills = await db.bill.findMany({
    select: {
      name: true,
      amount: true,
      dueDate: true,
      category: true,
      isPaid: true,
    },
    where: {
      OR: [
        // Unpaid bills that are due within 30 days
        {
          isPaid: false,
          dueDate: {
            lte: thirtyDaysFromNow.toISOString(),
            gte: today.toISOString()
          }
        },
        // Overdue bills
        {
          isPaid: false,
          dueDate: {
            lt: today.toISOString()
          }
        }
      ]
    },
    orderBy: {
      dueDate: 'asc'
    }
  });

  return bills.map(bill => {
    const dueDate = new Date(bill.dueDate);
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let status: 'overdue' | 'due-soon' | 'upcoming';
    if (daysUntilDue < 0) {
      status = 'overdue';
    } else if (daysUntilDue <= 7) {
      status = 'due-soon';
    } else {
      status = 'upcoming';
    }

    return {
      name: bill.name,
      amount: Number(bill.amount),
      dueDate: bill.dueDate,
      daysUntilDue,
      category: bill.category,
      status
    };
  });
}
