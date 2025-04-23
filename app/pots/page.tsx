import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

export default function PotsPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Pots</h1>
        <Button className="bg-zinc-900 hover:bg-zinc-800">+ Add New Pot</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Savings Pot */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold">Savings</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-2">
              <div className="text-sm text-gray-500">Total Saved</div>
              <div className="text-3xl font-bold">$159.00</div>
            </div>

            <div className="mb-4">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "8%" }}></div>
              </div>
              <div className="flex justify-between mt-1">
                <div className="text-sm text-gray-500">8.00%</div>
                <div className="text-sm text-gray-500">Target of $2,000</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">+ Add Money</Button>
              <Button variant="outline">Withdraw</Button>
            </div>
          </CardContent>
        </Card>

        {/* Concert Ticket Pot */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-600 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold">Concert Ticket</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-2">
              <div className="text-sm text-gray-500">Total Saved</div>
              <div className="text-3xl font-bold">$125.00</div>
            </div>

            <div className="mb-4">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-600 rounded-full" style={{ width: "83%" }}></div>
              </div>
              <div className="flex justify-between mt-1">
                <div className="text-sm text-gray-500">83.00%</div>
                <div className="text-sm text-gray-500">Target of $150</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">+ Add Money</Button>
              <Button variant="outline">Withdraw</Button>
            </div>
          </CardContent>
        </Card>

        {/* Gift Pot */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-sky-400 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold">Gift</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-2">
              <div className="text-sm text-gray-500">Total Saved</div>
              <div className="text-3xl font-bold">$110.00</div>
            </div>

            <div className="mb-4">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full" style={{ width: "73%" }}></div>
              </div>
              <div className="flex justify-between mt-1">
                <div className="text-sm text-gray-500">73.00%</div>
                <div className="text-sm text-gray-500">Target of $150</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">+ Add Money</Button>
              <Button variant="outline">Withdraw</Button>
            </div>
          </CardContent>
        </Card>

        {/* New Laptop Pot */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-300 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold">New Laptop</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-2">
              <div className="text-sm text-gray-500">Total Saved</div>
              <div className="text-3xl font-bold">$10.00</div>
            </div>

            <div className="mb-4">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-300 rounded-full" style={{ width: "1%" }}></div>
              </div>
              <div className="flex justify-between mt-1">
                <div className="text-sm text-gray-500">1.00%</div>
                <div className="text-sm text-gray-500">Target of $1,000</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">+ Add Money</Button>
              <Button variant="outline">Withdraw</Button>
            </div>
          </CardContent>
        </Card>

        {/* Holiday Pot */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold">Holiday</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-2">
              <div className="text-sm text-gray-500">Total Saved</div>
              <div className="text-3xl font-bold">$531.00</div>
            </div>

            <div className="mb-4">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: "37%" }}></div>
              </div>
              <div className="flex justify-between mt-1">
                <div className="text-sm text-gray-500">37.00%</div>
                <div className="text-sm text-gray-500">Target of $1,440</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">+ Add Money</Button>
              <Button variant="outline">Withdraw</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
