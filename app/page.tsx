import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { WalletCards, PiggyBank, Receipt, Calculator } from "lucide-react"

import { SpendingTrendsChart } from '@/components/overview/charts/SpendingTrendsChart'

export default function Home() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Personal Finance App</h2>
      </div>
      
      <SpendingTrendsChart />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/transactions">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <Receipt className="w-8 h-8 mb-2" />
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage your income and expenses</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/budgets">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <Calculator className="w-8 h-8 mb-2" />
              <CardTitle>Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Track your spending limits</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/pots">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <PiggyBank className="w-8 h-8 mb-2" />
              <CardTitle>Savings Pots</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage your savings goals</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/bills">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <WalletCards className="w-8 h-8 mb-2" />
              <CardTitle>Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Track recurring payments</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}