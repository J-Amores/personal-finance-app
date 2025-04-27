'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PotCard } from '@/components/pots/pot-card';
import { PotForm } from '@/components/pots/pot-form';
import { Pot, PotFormData } from '@/types/pots';
import { getPots } from '@/lib/pots';

export default function PotsPage() {
  const [pots, setPots] = useState<Pot[]>(getPots());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPot, setSelectedPot] = useState<Pot | undefined>();

  const handleCreatePot = (data: PotFormData) => {
    const newPot: Pot = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setPots(prev => [...prev, newPot]);
  };

  const handleEditPot = (data: PotFormData) => {
    if (!selectedPot) return;
    setPots(prev => prev.map(pot => 
      pot.id === selectedPot.id 
        ? { ...pot, ...data, updatedAt: new Date() }
        : pot
    ));
  };

  const handleDeletePot = (id: string) => {
    setPots(prev => prev.filter(pot => pot.id !== id));
  };

  const openEditForm = (pot: Pot) => {
    setSelectedPot(pot);
    setIsFormOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pots</h1>
        <Button 
          onClick={() => {
            setSelectedPot(undefined);
            setIsFormOpen(true);
          }}
          className="bg-zinc-900 hover:bg-zinc-800"
        >
          + Add New Pot
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pots.map(pot => (
          <PotCard
            key={pot.id}
            pot={pot}
            onEdit={openEditForm}
            onDelete={handleDeletePot}
          />
        ))}
      </div>

      <PotForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setSelectedPot(undefined);
        }}
        onSubmit={selectedPot ? handleEditPot : handleCreatePot}
        pot={selectedPot}
      />
    </div>
  );
}
