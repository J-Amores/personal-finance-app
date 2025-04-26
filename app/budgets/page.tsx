'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { BudgetList } from "@/components/budgets/budget-list"
import { BudgetSummaryCard } from "@/components/budgets/budget-summary-card"
import { Budget, BudgetSummary } from "@/types/budget"
import { BudgetForm } from "@/components/budgets/budget-form"
import data from '@/data.json'

// Calculate spent amounts from transactions
const calculateSpentByCategory = (category: string): number => {
  return data.transactions
    .filter(t => t.category === category && t.amount < 0)
    .reduce((total, t) => total + Math.abs(t.amount), 0)
}

// Transform budgets data from data.json
const initialBudgets: Budget[] = data.budgets.map((budget, index) => ({
  id: String(index + 1),
  category: budget.category,
  amount: budget.maximum,
  spent: calculateSpentByCategory(budget.category),
  period: 'monthly',
  color: budget.theme,
  createdAt: new Date(),
  updatedAt: new Date()
}))

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets)
  const [showForm, setShowForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)

  // Calculate budget summary from current budgets state
  const summary: BudgetSummary = {
    totalBudget: budgets.reduce((total, budget) => total + budget.amount, 0),
    totalSpent: budgets.reduce((total, budget) => total + budget.spent, 0),
    remainingBudget: budgets.reduce((total, budget) => total + (budget.amount - budget.spent), 0)
  }

  const handleAddBudget = (newBudget: Partial<Budget>) => {
    const budget: Budget = {
      id: String(budgets.length + 1),
      category: newBudget.category!,
      amount: newBudget.amount!,
      spent: 0,
      period: 'monthly',
      color: newBudget.color!,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setBudgets([...budgets, budget])
  }

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget)
    setShowForm(true)
  }

  const handleUpdateBudget = (updatedBudget: Partial<Budget>) => {
    if (!editingBudget) return

    const updated = budgets.map(budget => {
      if (budget.id === editingBudget.id) {
        return {
          ...budget,
          category: updatedBudget.category ?? budget.category,
          amount: updatedBudget.amount ?? budget.amount,
          color: updatedBudget.color ?? budget.color,
          updatedAt: new Date()
        }
      }
      return budget
    })

    setBudgets(updated)
    setEditingBudget(null)
  }

  const handleDeleteBudget = (budget: Budget) => {
    setBudgets(budgets.filter(b => b.id !== budget.id))
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
