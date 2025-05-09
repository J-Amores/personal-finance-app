"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useBudgets } from "@/hooks/use-budgets"
import { BudgetCard } from "@/components/budgets/BudgetCard"
import { BudgetDialog } from "@/components/budgets/BudgetDialog"
import { type Budget } from "@/types"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { formatCurrency } from "@/lib/utils"

const COLORS = ['#10B981', '#0EA5E9', '#F59E0B', '#6B7280']

export default function BudgetsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<Budget | undefined>()
  const { budgets, progress, createBudget, updateBudget, deleteBudget } = useBudgets()

  const handleSubmit = async (formData: {
    name: string
    category: string
    amount: number
    period: 'monthly' | 'quarterly' | 'yearly'
    isRecurring: boolean
    alerts: { enabled: boolean; threshold?: number }
    notes?: string
  }) => {
    const data = {
      ...formData,
      spent: selectedBudget?.spent || 0,
      startDate: selectedBudget?.startDate || new Date().toISOString()
    }
    try {
      if (selectedBudget) {
        await updateBudget.mutateAsync({ id: selectedBudget.id, data })
      } else {
        await createBudget.mutateAsync(data)
      }
      setDialogOpen(false)
      setSelectedBudget(undefined)
    } catch (error) {
      console.error('Failed to save budget:', error)
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Budgets</h1>
          <p className="text-gray-500">Manage your monthly spending limits</p>
        </div>
        <Button 
          className="bg-zinc-900 hover:bg-zinc-800"
          onClick={() => {
            setSelectedBudget(undefined)
            setDialogOpen(true)
          }}
        >
          + Add New Budget
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgets.isLoading ? (
          <div className="col-span-2">
            <p className="text-center">Loading budgets...</p>
          </div>
        ) : budgets.data?.length === 0 ? (
          <div className="col-span-2">
            <p className="text-center">No budgets found. Create your first budget to get started!</p>
          </div>
        ) : (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-center mb-4 h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={budgets.data || []}
                        dataKey="amount"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                      >
                        {(budgets.data || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {(budgets.data || []).map((budget: Budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onEdit={(budget) => {
                  setSelectedBudget(budget)
                  setDialogOpen(true)
                }}
                onDelete={(id) => deleteBudget.mutate(id)}
              />
            ))}
          </>
        )}
      </div>

      <BudgetDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selectedBudget}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

function DonutChart() {
  return (
    <div className="relative w-64 h-64">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="20" />
        {/* Dining Out - Largest segment (peach color) */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#fcd9bd"
          strokeWidth="20"
          strokeDasharray="125.6 125.6"
          strokeDashoffset="188.4"
          transform="rotate(-90 50 50)"
        />
        {/* Bills - Second largest (blue) */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#7dd3fc"
          strokeWidth="20"
          strokeDasharray="94.2 157"
          strokeDashoffset="62.8"
          transform="rotate(-90 50 50)"
        />
        {/* Personal Care - Medium (dark gray) */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#4b5563"
          strokeWidth="20"
          strokeDasharray="47.1 204.1"
          strokeDashoffset="-31.4"
          transform="rotate(-90 50 50)"
        />
        {/* Entertainment - Smallest (green) */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#10b981"
          strokeWidth="20"
          strokeDasharray="15.7 235.5"
          strokeDashoffset="-78.5"
          transform="rotate(-90 50 50)"
        />
        {/* Inner white circle to create donut */}
        <circle cx="50" cy="50" r="30" fill="white" />
      </svg>
    </div>
  )
}
