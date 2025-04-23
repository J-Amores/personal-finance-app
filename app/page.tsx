import { DollarSign, ChevronRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import Link from "next/link"

import { getBalance, formatCurrency } from '@/lib/data';

export default function Dashboard() {
  const balance = getBalance();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Overview</h1>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-zinc-900 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{formatCurrency(balance.current)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{formatCurrency(balance.income)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{formatCurrency(balance.expenses)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pots and Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pots Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Pots</CardTitle>
            <Link href="/pots" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
              See Details <ChevronRight size={16} />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-md flex items-center justify-center mr-3">
                    <DollarSign size={20} className="text-emerald-600" />
                  </div>
                  <div className="text-sm text-gray-600">Total Saved</div>
                </div>
                <div className="text-4xl font-bold">$935</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-1 h-10 bg-emerald-500 rounded-full mr-4"></div>
                    <div>Savings</div>
                  </div>
                  <div className="font-semibold">$159</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-1 h-10 bg-gray-600 rounded-full mr-4"></div>
                    <div>Concert Ticket</div>
                  </div>
                  <div className="font-semibold">$125</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-1 h-10 bg-sky-400 rounded-full mr-4"></div>
                    <div>Gift</div>
                  </div>
                  <div className="font-semibold">$110</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-1 h-10 bg-purple-500 rounded-full mr-4"></div>
                    <div>Holiday</div>
                  </div>
                  <div className="font-semibold">$531</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-1 h-10 bg-orange-300 rounded-full mr-4"></div>
                    <div>New Laptop</div>
                  </div>
                  <div className="font-semibold">$10</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budgets Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Budgets</CardTitle>
            <Link href="/budgets" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
              View All <ChevronRight size={16} />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <DonutChart />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-sm mr-2"></div>
                <span className="text-sm">Entertainment</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-sky-400 rounded-sm mr-2"></div>
                <span className="text-sm">Bills</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-300 rounded-sm mr-2"></div>
                <span className="text-sm">Dining Out</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-600 rounded-sm mr-2"></div>
                <span className="text-sm">Personal Care</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Section */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Transactions</CardTitle>
          <Link href="/transactions" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
            View All <ChevronRight size={16} />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-amber-800 rounded-full flex items-center justify-center mr-3">
                  <DollarSign size={16} className="text-white" />
                </div>
                <div>Savory Bites Bistro</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">- $55.50</div>
                <div className="text-sm text-gray-500">Aug 19, 2024</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                  <div className="w-full h-full bg-gray-400"></div>
                </div>
                <div>Emma Richardson</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">+ $75.50</div>
                <div className="text-sm text-gray-500">Aug 19, 2024</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recurring Bills Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Recurring Bills</CardTitle>
          <Link href="/recurring-bills" className="flex items-center text-sm text-gray-500 hover:text-gray-900">
            See Details <ChevronRight size={16} />
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">AQ</span>
                </div>
                <div>Aqua Flow Utilities</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">$100.00</div>
                <div className="text-sm text-gray-500">Monthly - 30th</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">EF</span>
                </div>
                <div>EcoFuel Energy</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">$35.00</div>
                <div className="text-sm text-gray-500">Monthly - 29th</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DonutChart() {
  return (
    <div className="relative w-48 h-48">
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
