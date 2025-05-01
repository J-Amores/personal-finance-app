'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { BudgetList } from "@/components/budgets/budget-list"
import { BudgetSummaryCard } from "@/components/budgets/budget-summary-card"
import { Budget, BudgetSummary } from "@/types/budget"
import { BudgetForm } from "@/components/budgets/budget-form"
import { getBudgets, createBudget, updateBudget, deleteBudget } from '@/app/actions/budgets'

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)

  // Fetch budgets on mount and when transactions change
  useEffect(() => {
    const loadBudgets = async () => {
      const { data, error } = await getBudgets()
      if (data) {
        setBudgets(data)
      } else if (error) {
        console.error('Error loading budgets:', error)
      }
    }

    loadBudgets()
  }, [])

  // Calculate budget summary from current budgets state
  const summary: BudgetSummary = {
    totalBudget: budgets.reduce((total, budget) => total + budget.amount, 0),
    totalSpent: budgets.reduce((total, budget) => total + budget.spent, 0),
    remainingBudget: budgets.reduce((total, budget) => total + (budget.amount - budget.spent), 0)
  }

  const handleAddBudget = async (newBudget: Partial<Budget>) => {
    const { data, error } = await createBudget({
      category: newBudget.category!,
      amount: newBudget.amount!,
      period: 'monthly',
      color: newBudget.color!, // Map color to theme for database
    })

    if (data) {
      const { data: updatedBudgets } = await getBudgets()
      if (updatedBudgets) {
        setBudgets(updatedBudgets)
      }
      setShowForm(false)
    } else if (error) {
      console.error('Error creating budget:', error)
    }
  }

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget)
    setShowForm(true)
  }

  const handleUpdateBudget = async (updatedBudget: Partial<Budget>) => {
    if (!editingBudget) return

    const { data, error } = await updateBudget(editingBudget.id, {
      category: updatedBudget.category,
      amount: updatedBudget.amount,
      color: updatedBudget.color, // Map color to theme for database
    })

    if (data) {
      const { data: updatedBudgets } = await getBudgets()
      if (updatedBudgets) {
        setBudgets(updatedBudgets)
      }
      setEditingBudget(null)
      setShowForm(false)
    } else if (error) {
      console.error('Error updating budget:', error)
    }
  }

  const handleDeleteBudget = async (budget: Budget) => {
    const { error } = await deleteBudget(budget.id)
    
    if (!error) {
      const { data: updatedBudgets } = await getBudgets()
      if (updatedBudgets) {
        setBudgets(updatedBudgets)
      }
    } else {
      console.error('Error deleting budget:', error)
    }
  }
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Budgets</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      <div className="space-y-6">
        <BudgetSummaryCard summary={summary} />
        
        <Card>
          <CardContent className="pt-6">
            <BudgetList 
              budgets={budgets} 
              onEdit={handleEditBudget}
              onDelete={handleDeleteBudget}
            />
          </CardContent>
        </Card>
      </div>

      <BudgetForm
        open={showForm}
        onOpenChange={setShowForm}
        onSubmit={editingBudget ? handleUpdateBudget : handleAddBudget}
        initialData={editingBudget ?? undefined}
        mode={editingBudget ? 'edit' : 'add'}
      />
    </div>
  )
}
