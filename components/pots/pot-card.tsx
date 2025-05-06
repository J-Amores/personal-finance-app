import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, Pencil, Trash2, Plus, Minus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { formatCurrency } from "@/lib/utils"
import { Pot } from "@prisma/client"
import { cn } from "@/lib/utils"

interface PotCardProps {
  pot: Pot
  onEdit: (pot: Pot) => void
  onDelete: (id: string) => void
  onAddFunds?: (id: string) => void
  onWithdraw?: (id: string) => void
}

const getThemeColors = (theme: string) => {
  const colors: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-100 dark:bg-blue-950', text: 'text-blue-500 dark:text-blue-400' },
    green: { bg: 'bg-green-100 dark:bg-green-950', text: 'text-green-500 dark:text-green-400' },
    red: { bg: 'bg-red-100 dark:bg-red-950', text: 'text-red-500 dark:text-red-400' },
    yellow: { bg: 'bg-yellow-100 dark:bg-yellow-950', text: 'text-yellow-500 dark:text-yellow-400' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-950', text: 'text-purple-500 dark:text-purple-400' },
    pink: { bg: 'bg-pink-100 dark:bg-pink-950', text: 'text-pink-500 dark:text-pink-400' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-950', text: 'text-orange-500 dark:text-orange-400' },
    teal: { bg: 'bg-teal-100 dark:bg-teal-950', text: 'text-teal-500 dark:text-teal-400' },
  }
  return colors[theme] || colors.blue
}

export function PotCard({ pot, onEdit, onDelete, onAddFunds, onWithdraw }: PotCardProps) {
  const progress = (pot.total / pot.target) * 100
  const themeColors = getThemeColors(pot.theme)

  return (
    <Card className={cn("w-full transition-colors", themeColors.bg)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className={cn("font-semibold text-lg leading-none", themeColors.text)}>
            {pot.name}
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onAddFunds && (
              <DropdownMenuItem onClick={() => onAddFunds(pot.id)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Funds
              </DropdownMenuItem>
            )}
            {onWithdraw && (
              <DropdownMenuItem onClick={() => onWithdraw(pot.id)}>
                <Minus className="mr-2 h-4 w-4" />
                Withdraw
              </DropdownMenuItem>
            )}
            {(onAddFunds || onWithdraw) && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={() => onEdit(pot)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(pot.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className={cn(
                "h-2 [&>div]:transition-all",
                progress >= 100 
                  ? "[&>div]:bg-green-500" 
                  : `[&>div]:${themeColors.text.replace('text', 'bg')}`
              )}
            />
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-medium">Current</p>
              <p className={cn("text-2xl font-bold", themeColors.text)}>
                {formatCurrency(pot.total)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Target</p>
              <p className="text-2xl font-bold">
                {formatCurrency(pot.target)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
