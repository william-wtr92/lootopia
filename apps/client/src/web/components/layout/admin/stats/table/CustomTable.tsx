"use client"

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@lootopia/ui"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  type ColumnDef,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { useState } from "react"

import CustomTablePagination from "@client/web/components/layout/admin/stats/table/CustomTablePagination"

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalPages: number
  pageIndex: number
  pageSize: number
  onPaginationChange: (pageIndex: number, pageSize: number) => void
  // sorting: SortingState
  // onSortingChange: (state: SortingState) => void
}

const CustomTable = <TData, TValue>({
  columns,
  data,
  totalPages,
  pageIndex,
  pageSize,
  onPaginationChange,
  // sorting: SortingState
}: DataTableProps<TData, TValue>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  // const [searchKey, setSearchKey] = useState<string>("")

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
      //   sorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater
      onPaginationChange(newPagination.pageIndex, newPagination.pageSize)
    },
    // getSortedRowModel: getSortedRowModel(),
  })

  const { getHeaderGroups, getRowModel } = table

  // const handleSearchKey = (key: string) => {
  //   setSearchKey(key)
  // }

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

  return (
    <div className="space-y-4">
      {/* <div className="flex items-center gap-4">
        <Input
          placeholder={`Search by ${searchKey ? searchKey : ""}`}
          onChange={(event) =>
            searchKey !== "" &&
            getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className={`max-w-sm ${colors.input}`}
        />

        <Select onValueChange={handleSearchKey}>
          <SelectTrigger className={`w-fit ${colors.select.trigger}`}>
            <SelectValue placeholder="Select the field you want to search in" />
          </SelectTrigger>

          <SelectContent className={`${colors.select.content}`}>
            <SelectGroup>
              <SelectLabel>Fields</SelectLabel>
              {getAllColumns().map((column) => {
                const key = column.id as string

                return (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div> */}

      <Table
        className={`${colors.tableComponent.borderRadius} overflow-hidden`}
      >
        <TableHeader
          className={`${colors.header.background} ${colors.header.text}`}
        >
          {headerGroups.map((headerGroup) => (
            <TableRow key={headerGroup.id}>
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
                No results.
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
