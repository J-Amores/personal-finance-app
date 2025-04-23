import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { getTransactions, formatCurrency, formatDate } from '@/lib/data';

export default function TransactionsPage() {
  const transactions = getTransactions();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-auto md:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search transaction" className="pl-10" />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by</span>
                <Button variant="outline" className="flex items-center">
                  Latest <span className="ml-2">▼</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Category</span>
                <Button variant="outline" className="flex items-center">
                  All Transactions <span className="ml-2">▼</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-2 font-medium">Recipient/Sender</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium">Transaction Date</th>
                  <th className="pb-2 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.slice(0, 10).map((transaction, index) => (
                  <tr key={index} className="py-4">
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img 
                            src={transaction.avatar.replace('./', '/')} 
                            alt={transaction.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>{transaction.name}</div>
                      </div>
                    </td>
                    <td className="py-4">{transaction.category}</td>
                    <td className="py-4">{formatDate(transaction.date)}</td>
                    <td className={`py-4 text-right font-medium ${transaction.amount > 0 ? 'text-green-600' : ''}`}>
                      {transaction.amount > 0 ? '+ ' : ''}{formatCurrency(Math.abs(transaction.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <div className="text-sm text-gray-500">Page 1 of {Math.ceil(transactions.length / 10)}</div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
