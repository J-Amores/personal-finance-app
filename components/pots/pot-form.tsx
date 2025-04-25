'use client';

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pot, PotFormData } from "@/types/pot";

interface PotFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PotFormData) => void;
  initialData?: Pot;
}

export function PotForm({ open, onClose, onSubmit, initialData }: PotFormProps) {
  const [formData, setFormData] = useState<PotFormData>(() => ({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    currentAmount: initialData?.currentAmount ?? 0,
    targetAmount: initialData?.targetAmount ?? 0,
    color: initialData?.color ?? '#10B981' // Default emerald color
  }));

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description ?? '',
        currentAmount: initialData.currentAmount,
        targetAmount: initialData.targetAmount,
        color: initialData.color
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Pot' : 'Create New Pot'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                name: e.target.value
              }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentAmount">Current Amount</Label>
              <Input
                id="currentAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.currentAmount}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  currentAmount: parseFloat(e.target.value) || 0
                }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount</Label>
              <Input
                id="targetAmount"
                type="number"
                min="0"
                step="0.01"
                value={formData.targetAmount}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  targetAmount: parseFloat(e.target.value) || 0
                }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  color: e.target.value
                }))}
                className="w-12 h-10 p-1"
                required
              />
              <Input
                value={formData.color}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  color: e.target.value
                }))}
                className="flex-1"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Save Changes' : 'Create Pot'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
