import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lootopia/ui"
import type { Table } from "@tanstack/react-table"
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react"

type DataTablePaginationProps<TData> = {
  table: Table<TData>
}

const CustomTablePagination = <TData,>({
  table,
}: DataTablePaginationProps<TData>) => {
  const colors = {
    input: {
      background: "bg-primaryBg",
      text: "text-primary",
      border: "border-0",
    },
    select: {
      trigger: "bg-primaryBg text-primary border-0",
      content: "bg-primaryBg text-primary border-0",
    },
  }

  const {
    previousPage,
    nextPage,
    getFilteredSelectedRowModel,
    getFilteredRowModel,
    getState,
    getCanPreviousPage,
    getCanNextPage,
    getPageCount,
    setPageSize,
    setPageIndex,
  } = table

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-muted-foreground flex-1 text-sm">
        {getFilteredSelectedRowModel().rows.length} of{" "}
        {getFilteredRowModel().rows.length} row(s) selected.
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${getState().pagination.pageSize}`}
            onValueChange={(value) => {
              setPageSize(Number(value))
            }}
          >
            <SelectTrigger className={`h-8 w-[70px] ${colors.select.trigger}`}>
              <SelectValue placeholder={getState().pagination.pageSize} />
            </SelectTrigger>

            <SelectContent side="top" className={`${colors.select.content}`}>
              {[1, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {getState().pagination.pageIndex + 1} of {getPageCount()}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPageIndex(0)}
            disabled={!getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>

          <Button
            variant="default"
            className="h-8 w-8 p-0"
            onClick={() => previousPage()}
            disabled={!getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>

          <Button
            variant="default"
            className="h-8 w-8 p-0"
            onClick={() => nextPage()}
            disabled={!getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>

          <Button
            variant="default"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPageIndex(getPageCount())}
            disabled={!getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CustomTablePagination
