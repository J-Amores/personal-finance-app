import { db } from '@/lib/db';

export type PotProgress = {
  name: string;
  current: number;
  target: number;
  percentage: number;
  remainingAmount: number;
};

export async function getPotsProgress(): Promise<PotProgress[]> {
  const pots = await db.pot.findMany({
    select: {
      name: true,
      currentAmount: true,
      targetAmount: true,
    },
    where: {
      // Only show active pots
      OR: [
        { endDate: null },
        { endDate: { gt: new Date().toISOString() } }
      ]
    },
    orderBy: {
      percentage: 'desc'
    }
  });

  return pots.map(pot => ({
    name: pot.name,
    current: Number(pot.currentAmount),
    target: Number(pot.targetAmount),
    percentage: Math.round((Number(pot.currentAmount) / Number(pot.targetAmount)) * 100),
    remainingAmount: Number(pot.targetAmount) - Number(pot.currentAmount)
  }));
}
