import type { Column } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import React from "react"

type Props<TData> = {
  name: string
  column: Column<TData, unknown>
  handleSorting: (key: keyof TData) => void
}

const HeaderCell = <TData,>({ name, column, handleSorting }: Props<TData>) => {
  const columnId = column.id as keyof TData

  return (
    <span
      className="hover:bg-secondary flex size-full cursor-pointer items-center gap-2 rounded-lg px-2 duration-300"
      onClick={() => handleSorting(columnId)}
    >
      <span>{name}</span>
      <ArrowUpDown className="size-4" />
    </span>
  )
}

export default HeaderCell
