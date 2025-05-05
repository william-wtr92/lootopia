"use client"

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
  Input,
} from "@lootopia/ui"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"

import CustomTablePagination from "@client/web/components/layout/admin/table/CustomTablePagination"

type PaginationProps = {
  totalPages: number
  pageIndex: number
  pageSize: number
}

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  paginationValues: PaginationProps
  searchValue: string
  onPaginationChange: (pageIndex: number, pageSize: number) => void
  handleSearchValue: (value: string) => void
}

const CustomTable = <TData, TValue>({
  columns,
  data,
  paginationValues,
  searchValue,
  onPaginationChange,
  handleSearchValue,
}: DataTableProps<TData, TValue>) => {
  const t = useTranslations("Components.Admin.CustomTable")

  const { totalPages, pageIndex, pageSize } = paginationValues

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    pageCount: totalPages,
    state: {
      columnFilters,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater

      onPaginationChange(newPagination.pageIndex, newPagination.pageSize)
    },
  })

  const { getHeaderGroups, getRowModel } = table

  const colors = {
    input: "bg-primaryBg text-primary border-0",
    select: {
      trigger: "bg-primaryBg text-primary border-0",
      content: "bg-primaryBg text-primary border-0",
    },
    tableComponent: {
      borderRadius: "rounded-lg",
    },
    header: {
      background: "bg-primary",
      text: "text-white",
    },
    body: {
      row: {
        background: "bg-primaryBg",
        text: "",
        borderColor: "border-primary",
      },
      cell: {
        padding: "py-4",
      },
    },
  }

  const headerGroups = getHeaderGroups()
  const rows = getRowModel().rows

  const hasResults = rows.length > 0

  const debouncedCallback = useDebouncedCallback((value: string) => {
    handleSearchValue(value)
  }, 600)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          defaultValue={searchValue}
          onChange={(e) => debouncedCallback(e.target.value)}
          placeholder={t("inputPlaceholder")}
          className={`max-w-sm ${colors.input}`}
        />
      </div>

      <Table
        className={`${colors.tableComponent.borderRadius} overflow-hidden`}
      >
        <TableHeader
          className={`${colors.header.background} ${colors.header.text}`}
        >
          {headerGroups.map((headerGroup) => (
            <TableRow key={headerGroup.id} className="px-0">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {hasResults ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={`${colors.body.row.background} ${colors.body.row.borderColor}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`${colors.body.cell.padding}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {t("noResults")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CustomTablePagination table={table} />
    </div>
  )
}

export default CustomTable
