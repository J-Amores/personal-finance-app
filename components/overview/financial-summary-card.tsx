import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FinancialSummaryCardProps {
  title: string;
  amount: number;
  variant?: 'default' | 'dark' | 'success' | 'destructive';
  className?: string;
}

export function FinancialSummaryCard({ 
  title, 
  amount, 
  variant = 'default',
  className,
}: FinancialSummaryCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const variants = {
    default: '',
    dark: 'bg-zinc-900 text-white',
    success: 'bg-green-50 border-green-200',
    destructive: 'bg-red-50 border-red-200'
  }

  return (
    <Card className={cn(variants[variant], className)}>
      <CardHeader className="pb-2">
        <CardTitle 
          className={cn(
            "text-sm font-medium",
            variant === 'default' && "text-gray-600",
            variant === 'success' && "text-green-700",
            variant === 'destructive' && "text-red-700"
          )}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "text-4xl font-bold",
          variant === 'success' && "text-green-700",
          variant === 'destructive' && "text-red-700"
        )}>
          {formatCurrency(amount)}
        </div>
      </CardContent>
    </Card>
  );
}
