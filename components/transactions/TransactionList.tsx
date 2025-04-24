import { formatDate } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Transaction {
  name: string;
  avatar: string;
  category: string;
  date: string;
  amount: number;
}

interface TransactionListProps {
  transactions: Transaction[];
  maxHeight?: string;
  showScrollbar?: boolean;
}

export function TransactionList({ 
  transactions,
  maxHeight = "400px",
  showScrollbar = true
}: TransactionListProps) {

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(value));
  };

  return (
    <div className="relative w-full" style={{ height: maxHeight }}>
      <ScrollArea className="h-full w-full" scrollHideDelay={0}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead>Recipient/Sender</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Transaction Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage 
                        src={transaction.avatar.replace('./', '/')} 
                        alt={transaction.name}
                      />
                      <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>{transaction.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{transaction.category}</Badge>
                </TableCell>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell className={`text-right font-medium ${transaction.amount > 0 ? 'text-green-600' : ''}`}>
                  {transaction.amount > 0 ? '+ ' : ''}{formatCurrency(transaction.amount)}
                </TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}
