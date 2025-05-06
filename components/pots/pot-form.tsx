import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Pot } from "@prisma/client"

const potFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  target: z
    .number()
    .min(0.01, "Target amount must be greater than 0")
    .max(1000000, "Target amount must be less than 1,000,000"),
  total: z
    .number()
    .min(0, "Current amount must be greater than or equal to 0")
    .max(1000000, "Current amount must be less than 1,000,000")
    .default(0),
  theme: z
    .string()
    .min(1, "Theme is required")
    .max(50, "Theme must be less than 50 characters")
})

type PotFormValues = z.infer<typeof potFormSchema>

interface PotFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<Pot, 'id' | 'createdAt' | 'updatedAt'>) => void
  pot?: Pot
}

const themeOptions = [
  'blue',
  'green',
  'red',
  'yellow',
  'purple',
  'pink',
  'orange',
  'teal'
] as const

export function PotForm({ open, onOpenChange, onSubmit, pot }: PotFormProps) {
  const form = useForm<PotFormValues>({
    resolver: zodResolver(potFormSchema),
    defaultValues: {
      name: pot?.name || "",
      target: pot?.target || 0,
      total: pot?.total || 0,
      theme: pot?.theme || themeOptions[0],
    },
  })

  const handleSubmit = (data: PotFormValues) => {
    onSubmit(data)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{pot ? "Edit Pot" : "Create New Pot"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Vacation Fund" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="5000"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseFloat(e.target.value) : 0
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme Color</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-4 gap-2">
                      {themeOptions.map((theme) => (
                        <Button
                          key={theme}
                          type="button"
                          variant={field.value === theme ? "default" : "outline"}
                          className={`h-8 w-full bg-${theme}-500 hover:bg-${theme}-600 ${field.value === theme ? 'ring-2 ring-offset-2' : ''}`}
                          onClick={() => field.onChange(theme)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {pot ? "Save Changes" : "Create Pot"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
