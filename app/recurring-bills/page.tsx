import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Receipt } from "lucide-react"

export default function RecurringBillsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Recurring Bills</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="bg-zinc-900 text-white mb-6">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Receipt className="h-6 w-6" />
                <CardTitle className="text-sm font-medium">Total bills</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">$384.98</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Paid Bills</span>
                  <span className="font-medium">4 ($190.00)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Upcoming</span>
                  <span className="font-medium">2 ($135.00)</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Due Soon</span>
                  <span className="font-medium">2 ($59.98)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search bills" className="pl-10" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort by</span>
              <Button variant="outline" className="flex items-center">
                Latest <span className="ml-2">▼</span>
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 text-sm text-gray-500 mb-4">
                <div>Bill Title</div>
                <div className="text-center">Due Date</div>
                <div className="text-right">Amount</div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="flex items-center flex-1">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                      <img src="/assets/images/avatars/aqua-flow-utilities.jpg" alt="Aqua Flow Utilities" className="w-full h-full object-cover" />
                    </div>
                    <div>Aqua Flow Utilities</div>
                  </div>
                  <div className="flex-1 text-center text-sm text-green-600">Monthly - 30th</div>
                  <div className="flex-1 text-right font-semibold">$100.00</div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center flex-1">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                      <img src="/assets/images/avatars/ecofuel-energy.jpg" alt="EcoFuel Energy" className="w-full h-full object-cover" />
                    </div>
                    <div>EcoFuel Energy</div>
                  </div>
                  <div className="flex-1 text-center text-sm text-green-600">Monthly - 29th</div>
                  <div className="flex-1 text-right font-semibold">$35.00</div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center flex-1">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                      <img src="/assets/images/avatars/bytewise.jpg" alt="ByteWise" className="w-full h-full object-cover" />
                    </div>
                    <div>ByteWise</div>
                  </div>
                  <div className="flex-1 text-center text-sm text-red-500">Monthly - 23rd ⚠️</div>
                  <div className="flex-1 text-right font-semibold text-red-500">$49.99</div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center flex-1">
                    <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs">ND</span>
                    </div>
                    <div>Nimbus Data Storage</div>
                  </div>
                  <div className="flex-1 text-center text-sm text-red-500">Monthly - 21st ⚠️</div>
                  <div className="flex-1 text-right font-semibold text-red-500">$9.99</div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center flex-1">
                    <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs">PP</span>
                    </div>
                    <div>Pixel Playground</div>
                  </div>
                  <div className="flex-1 text-center text-sm text-green-600">Monthly - 11th ✓</div>
                  <div className="flex-1 text-right font-semibold">$10.00</div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center flex-1">
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs">EE</span>
                    </div>
                    <div>Elevate Education</div>
                  </div>
                  <div className="flex-1 text-center text-sm text-green-600">Monthly - 4th ✓</div>
                  <div className="flex-1 text-right font-semibold">$50.00</div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center flex-1">
                    <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs">SS</span>
                    </div>
                    <div>Serenity Spa & Wellness</div>
                  </div>
                  <div className="flex-1 text-center text-sm text-green-600">Monthly - 3rd ✓</div>
                  <div className="flex-1 text-right font-semibold">$30.00</div>
                </div>

                <div className="flex items-center">
                  <div className="flex items-center flex-1">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs">SE</span>
                    </div>
                    <div>Spark Electric Solutions</div>
                  </div>
                  <div className="flex-1 text-center text-sm text-green-600">Monthly - 2nd ✓</div>
                  <div className="flex-1 text-right font-semibold">$100.00</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
