import {
  TableHeader,
  TableHead, TableRow
} from '@/components/ui/table'

export default function TableHeaders() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="hidden w-[100px] sm:table-cell">
          <span className="sr-only">Image</span>
        </TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Price</TableHead>
        <TableHead className="hidden md:table-cell">
          Total Sales
        </TableHead>
        <TableHead className="hidden md:table-cell">
          Created at
        </TableHead>
        <TableHead>
          <span className="sr-only">Actions</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  )

}
