'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Pot } from "@/types/pot";
import { formatCurrency } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PotCardProps {
  pot: Pot;
  onEdit: (pot: Pot) => void;
  onDelete: (id: string) => void;
}

export function PotCard({ pot, onEdit, onDelete }: PotCardProps) {
  const progress = (pot.currentAmount / pot.targetAmount) * 100;
  const formattedProgress = Math.min(100, Math.round(progress * 100) / 100);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div 
              className="w-2 h-2 rounded-full mr-2" 
              style={{ backgroundColor: pot.color }}
            />
            <div>
              <h3 className="text-lg font-semibold">{pot.name}</h3>
              {pot.description && (
                <p className="text-sm text-gray-500">{pot.description}</p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(pot)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the "{pot.name}" pot and all its data.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    onDelete(pot.id);
                    setShowDeleteDialog(false);
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="mb-2">
          <div className="text-sm text-gray-500">Total Saved</div>
          <div className="text-3xl font-bold">
            {formatCurrency(pot.currentAmount)}
          </div>
        </div>

        <div className="mb-4">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300" 
              style={{ 
                width: `${formattedProgress}%`,
                backgroundColor: pot.color 
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <div className="text-sm text-gray-500">{formattedProgress}%</div>
            <div className="text-sm text-gray-500">
              Target of {formatCurrency(pot.targetAmount)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
