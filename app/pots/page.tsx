'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PotCard } from '@/components/pots/pot-card';
import { PotForm } from '@/components/pots/pot-form';
import { Pot } from '@prisma/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { potService, PotServiceError } from '@/lib/services/pot-service';
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Plus } from 'lucide-react';
import { PotsProgressChart } from '@/components/pots/charts/PotsProgressChart';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog } from "@/components/ui/dialog";
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

const amountFormSchema = z.object({
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(1000000, "Amount must be less than 1,000,000"),
});

type AmountFormValues = z.infer<typeof amountFormSchema>;

export default function PotsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPot, setSelectedPot] = useState<Pot | undefined>();
  const [isAmountDialogOpen, setIsAmountDialogOpen] = useState(false);
  const [amountAction, setAmountAction] = useState<'add' | 'withdraw'>('add');
  const [selectedPotId, setSelectedPotId] = useState<string>('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const amountForm = useForm<AmountFormValues>({
    resolver: zodResolver(amountFormSchema),
    defaultValues: {
      amount: 0,
    },
  });

  // Fetch pots
  const { data: pots = [], error: fetchError, isLoading } = useQuery<Pot[], PotServiceError>({
    queryKey: ['pots'],
    queryFn: potService.getPots,
  });

  // Create pot mutation
  const createPot = useMutation({
    mutationFn: potService.createPot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pots'] });
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Pot created successfully",
      });
    },
    onError: (error: PotServiceError) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // Update pot mutation
  const updatePot = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Pot, 'id' | 'createdAt' | 'updatedAt'>> }) => 
      potService.updatePot(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pots'] });
      setIsFormOpen(false);
      setSelectedPot(undefined);
      toast({
        title: "Success",
        description: "Pot updated successfully",
      });
    },
    onError: (error: PotServiceError) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // Delete pot mutation
  const deletePot = useMutation({
    mutationFn: potService.deletePot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pots'] });
      toast({
        title: "Success",
        description: "Pot deleted successfully",
      });
    },
    onError: (error: PotServiceError) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // Add to pot mutation
  const addToPot = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      potService.addToPot(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pots'] });
      setIsAmountDialogOpen(false);
      amountForm.reset();
      toast({
        title: "Success",
        description: "Funds added successfully",
      });
    },
    onError: (error: PotServiceError) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  // Withdraw from pot mutation
  const withdrawFromPot = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      potService.withdrawFromPot(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pots'] });
      setIsAmountDialogOpen(false);
      amountForm.reset();
      toast({
        title: "Success",
        description: "Funds withdrawn successfully",
      });
    },
    onError: (error: PotServiceError) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleCreatePot = (data: Omit<Pot, 'id' | 'createdAt' | 'updatedAt'>) => {
    createPot.mutate(data);
  };

  const handleEditPot = (data: Omit<Pot, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedPot) return;
    updatePot.mutate({
      id: selectedPot.id,
      data: data,
    });
  };

  const handleDeletePot = (id: string) => {
    deletePot.mutate(id);
  };

  const openEditForm = (pot: Pot) => {
    setSelectedPot(pot);
    setIsFormOpen(true);
  };

  const handleAddFunds = (id: string) => {
    setSelectedPotId(id);
    setAmountAction('add');
    setIsAmountDialogOpen(true);
  };

  const handleWithdraw = (id: string) => {
    setSelectedPotId(id);
    setAmountAction('withdraw');
    setIsAmountDialogOpen(true);
  };

  const handleAmountSubmit = (data: AmountFormValues) => {
    if (amountAction === 'add') {
      addToPot.mutate({ id: selectedPotId, amount: data.amount });
    } else {
      withdrawFromPot.mutate({ id: selectedPotId, amount: data.amount });
    }
  };

  if (fetchError) {
    return (
      <div>
        <div className="mb-6">
          <PotsProgressChart />
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {fetchError.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Savings Pots</h1>
        <Button 
          onClick={() => {
            setSelectedPot(undefined);
            setIsFormOpen(true);
          }}
        >
          + Add New Pot
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : pots.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-8">
            No savings pots yet. Create one to get started!
          </p>
        ) : (
          pots.map(pot => (
            <PotCard
              key={pot.id}
              pot={pot}
              onEdit={openEditForm}
              onDelete={handleDeletePot}
              onAddFunds={handleAddFunds}
              onWithdraw={handleWithdraw}
            />
          ))
        )}
      </div>

      <PotForm
        open={isFormOpen}
        onOpenChange={(open: boolean) => {
          setIsFormOpen(open);
          if (!open) setSelectedPot(undefined);
        }}
        onSubmit={selectedPot ? handleEditPot : handleCreatePot}
        pot={selectedPot}
      />

      <Dialog open={isAmountDialogOpen} onOpenChange={setIsAmountDialogOpen}>
        <Form {...amountForm}>
          <form onSubmit={amountForm.handleSubmit(handleAmountSubmit)} className="space-y-4">
            <FormField
              control={amountForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{amountAction === 'add' ? 'Add Amount' : 'Withdraw Amount'}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAmountDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {amountAction === 'add' ? 'Add Funds' : 'Withdraw'}
              </Button>
            </div>
          </form>
        </Form>
      </Dialog>
    </div>
  );
}
