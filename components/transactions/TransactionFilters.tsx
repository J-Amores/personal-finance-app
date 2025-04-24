import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TransactionFiltersProps {
  onSortChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  selectedSort?: string;
  selectedCategory?: string;
  categories: string[];
}

export function TransactionFilters({
  onSortChange,
  onCategoryChange,
  selectedSort = "latest",
  selectedCategory = "all",
  categories
}: TransactionFiltersProps) {
  return (
    <div className="flex items-center gap-4 w-full md:w-auto">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Sort by</span>
        <Select value={selectedSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="highest">Highest Amount</SelectItem>
            <SelectItem value="lowest">Lowest Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Category</span>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
