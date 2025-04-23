import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ChevronRight } from "lucide-react"

export default function BudgetsPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Budgets</h1>
        <Button className="bg-zinc-900 hover:bg-zinc-800">+ Add New Budget</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
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

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-emerald-500 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold">Entertainment</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-2">
              <div className="text-sm text-gray-500">Maximum of $50.00</div>
            </div>

            <div className="mb-4">
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "30%" }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-sm text-gray-500">Spent</div>
                <div className="text-xl font-bold">$15</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Remaining</div>
                <div className="text-xl font-bold">$35</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Latest Spending</h4>
                <Button variant="ghost" size="sm" className="h-8 flex items-center text-sm text-gray-500">
                  See All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-4 bg-gray-50 p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                      <img src="/assets/images/avatars/pixel-playground.jpg" alt="Pixel Playground" className="w-full h-full object-cover" />
                    </div>
                    <div>Pixel Playground</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">- $10.00</div>
                    <div className="text-xs text-gray-500">11/08/2024</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                      <img src="/assets/images/avatars/james-thompson.jpg" alt="James Thompson" className="w-full h-full object-cover" />
                    </div>
                    <div>James Thompson</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">- $5.00</div>
                    <div className="text-xs text-gray-500">11/08/2024</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden mr-3">
                      <div className="w-full h-full bg-gray-400"></div>
                    </div>
                    <div>Rina Sato</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">- $10.00</div>
                    <div className="text-xs text-gray-500">13/07/2024</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-sky-400 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold">Bills</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-2">
              <div className="text-sm text-gray-500">Maximum of $400.00</div>
            </div>

            <div className="mb-4">
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Spent</div>
                <div className="text-xl font-bold">$340</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Remaining</div>
                <div className="text-xl font-bold">$60</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-300 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold">Dining Out</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-2">
              <div className="text-sm text-gray-500">Maximum of $200.00</div>
            </div>

            <div className="mb-4">
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-300 rounded-full" style={{ width: "44%" }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Spent</div>
                <div className="text-xl font-bold">$88</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Remaining</div>
                <div className="text-xl font-bold">$112</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-600 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold">Personal Care</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-2">
              <div className="text-sm text-gray-500">Maximum of $100.00</div>
            </div>

            <div className="mb-4">
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-600 rounded-full" style={{ width: "25%" }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Spent</div>
                <div className="text-xl font-bold">$25</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Remaining</div>
                <div className="text-xl font-bold">$75</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
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
