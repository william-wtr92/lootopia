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
import { useTranslations } from "next-intl"

type DataTablePaginationProps<TData> = {
  table: Table<TData>
}

const CustomTablePagination = <TData,>({
  table,
}: DataTablePaginationProps<TData>) => {
  const t = useTranslations("Components.Admin.CustomTable")

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
        {getFilteredSelectedRowModel().rows.length}{" "}
        {t("pagination.rowsSelected.of")} {getFilteredRowModel().rows.length}{" "}
        {t("pagination.rowsSelected.endOfLine")}
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">
            {t("pagination.rowsPerPage.label")}
          </p>
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
          {t("pagination.currentPage.label")}{" "}
          {getState().pagination.pageIndex + 1} {t("pagination.currentPage.of")}{" "}
          {getPageCount()}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPageIndex(0)}
            disabled={!getCanPreviousPage()}
          >
            <span className="sr-only">{t("pagination.controls.first")}</span>
            <ChevronsLeft />
          </Button>

          <Button
            variant="default"
            className="h-8 w-8 p-0"
            onClick={() => previousPage()}
            disabled={!getCanPreviousPage()}
          >
            <span className="sr-only">{t("pagination.controls.previous")}</span>
            <ChevronLeft />
          </Button>

          <Button
            variant="default"
            className="h-8 w-8 p-0"
            onClick={() => nextPage()}
            disabled={!getCanNextPage()}
          >
            <span className="sr-only">{t("pagination.controls.next")}</span>
            <ChevronRight />
          </Button>

          <Button
            variant="default"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => setPageIndex(getPageCount())}
            disabled={!getCanNextPage()}
          >
            <span className="sr-only">{t("pagination.controls.last")}</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CustomTablePagination
