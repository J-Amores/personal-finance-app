'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { BudgetCard } from '@/components/budgets/budget-card';
import { BudgetForm } from '@/components/budgets/budget-form';
import { Budget } from '@/types/budget';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService, BudgetServiceError } from '@/lib/services/budget-service';
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Plus } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreateBudgetData } from '@/lib/services/budget-service';

const amountFormSchema = z.object({
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(1000000, "Amount must be less than 1,000,000"),
});

type AmountFormValues = z.infer<typeof amountFormSchema>;

export default function BudgetsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isAmountDialogOpen, setIsAmountDialogOpen] = useState(false);
  const [amountAction, setAmountAction] = useState<'add' | 'withdraw'>('add');
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const amountForm = useForm<AmountFormValues>({
    resolver: zodResolver(amountFormSchema),
    defaultValues: {
      amount: 0,
    },
  });

  // Query for fetching budgets
  const { data: budgets, error: budgetsError } = useQuery<Budget[], BudgetServiceError>({
    queryKey: ['budgets'],
    queryFn: () => budgetService.getBudgets(),
  });

  // Mutation for creating a budget
  const createBudgetMutation = useMutation({
    mutationFn: (data: Omit<Budget, 'id' | 'spent' | 'createdAt' | 'updatedAt'>) => 
      budgetService.createBudget(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Budget created successfully",
      });
    },
    onError: (error: BudgetServiceError) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for updating a budget
  const updateBudgetMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Budget, 'id' | 'spent' | 'createdAt' | 'updatedAt'>> }) =>
      budgetService.updateBudget(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setIsFormOpen(false);
      setSelectedBudget(null);
      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
    },
    onError: (error: BudgetServiceError) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for deleting a budget
  const deleteBudgetMutation = useMutation({
    mutationFn: (id: string) => budgetService.deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast({
        title: "Success",
        description: "Budget deleted successfully",
      });
    },
    onError: (error: BudgetServiceError) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for adjusting budget amount
  const adjustBudgetAmountMutation = useMutation({
    mutationFn: ({ id, amount, action }: { id: string; amount: number; action: 'add' | 'withdraw' }) =>
      budgetService.adjustBudgetAmount(id, amount, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      setIsAmountDialogOpen(false);
      amountForm.reset();
      toast({
        title: "Success",
        description: `Amount ${amountAction}ed successfully`,
      });
    },
    onError: (error: BudgetServiceError) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAmountSubmit = async (values: AmountFormValues) => {
    if (!selectedBudgetId) return;

    await adjustBudgetAmountMutation.mutateAsync({
      id: selectedBudgetId,
      amount: values.amount,
      action: amountAction,
    });
  };

  if (budgetsError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{budgetsError.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Budgets</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets?.map((budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            onEdit={() => {
              setSelectedBudget(budget);
              setIsFormOpen(true);
            }}
            onDelete={() => deleteBudgetMutation.mutate(budget.id)}
            onAddAmount={(id) => {
              setSelectedBudgetId(id);
              setAmountAction('add');
              setIsAmountDialogOpen(true);
            }}
            onWithdrawAmount={(id) => {
              setSelectedBudgetId(id);
              setAmountAction('withdraw');
              setIsAmountDialogOpen(true);
            }}
          />
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <BudgetForm
            onSubmit={async (formData) => {
              try {
                setIsSubmitting(true);

                const data = {
                  ...formData,
                  startDate: formData.startDate.toISOString(),
                  endDate: formData.endDate?.toISOString(),
                };

                if (selectedBudget) {
                  await budgetService.updateBudget(selectedBudget.id, data);
                } else {
                  await budgetService.createBudget(data);
                }

                await queryClient.invalidateQueries({ queryKey: ['budgets'] });
                toast({ title: selectedBudget ? 'Budget updated' : 'Budget created', variant: 'default' });
                setIsFormOpen(false);
              } catch (error) {
                toast({ title: 'Failed to save budget', variant: 'destructive' });
              } finally {
                setIsSubmitting(false);
              }
            }}
            onCancel={() => {
              setIsFormOpen(false);
              setSelectedBudget(null);
            }}
            budget={selectedBudget}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isAmountDialogOpen} onOpenChange={setIsAmountDialogOpen}>
        <DialogContent>
          <Form {...amountForm}>
            <form onSubmit={amountForm.handleSubmit(handleAmountSubmit)} className="space-y-4">
              <FormField
                control={amountForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount to {amountAction}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={adjustBudgetAmountMutation.isPending}>
                {amountAction.charAt(0).toUpperCase() + amountAction.slice(1)} Amount
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
