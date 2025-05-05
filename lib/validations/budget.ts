import * as z from 'zod';

export const budgetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  period: z.enum(['monthly', 'yearly', 'quarterly']),
  startDate: z.date(),
  endDate: z.date().optional(),
  notes: z.string().optional(),
  isRecurring: z.boolean().default(true),
  alerts: z.object({
    enabled: z.boolean().default(false),
    threshold: z.number().min(0, 'Threshold must be positive').optional(),
  }).default({ enabled: false }),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;
