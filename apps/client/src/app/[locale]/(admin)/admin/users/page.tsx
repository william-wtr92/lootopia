"use client"

import { Button } from "@lootopia/ui"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { useLocale } from "next-intl"
import React, { useState } from "react"

import CustomTable from "@client/web/components/layout/admin/stats/table/CustomTable"
import {
  getUsersList,
  type UserWithPrivateInfo,
} from "@client/web/services/admin/users/getUsersList"
import { formatDate } from "@client/web/utils/helpers/formatDate"

// {
//   "id": "7e71ca8a-8ffd-4d28-b05c-da188edaeb60",
//   "nickname": "JohnDodzadaddzaddeadddzd",
//   "email": "johndodazdazdddzadedzdda@example.com",
//   "phone": "900989991",
//   "birthdate": "1995-06-15T00:00:00.000Z",
//   "progression": {
//     "level": 1,
//     "experience": 0
//   },
//   "avatar": null
// },

const StatsUsersPage = () => {
  const locale = useLocale()

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 1 })

  const { data } = useQuery({
    queryKey: ["adminUsersList", pagination],
    queryFn: () =>
      getUsersList({
        limit: pagination.pageSize,
        page: pagination.pageIndex,
        search: "",
      }),
  })

  const columns: ColumnDef<UserWithPrivateInfo>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "nickname",
      header: "Nickname",
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "birthdate",
      header: "Birthdate",
      cell: ({ row }) => formatDate(row.original.birthdate, locale),
    },
    {
      accessorKey: "progression.level",
      header: "Level",
    },
    // {
    //   id: "Actions",
    //   header: "Actions",
    //   cell: ({ row }) => {
    //     const payment = row.original

    //     return (
    //       <DropdownMenu>
    //         <DropdownMenuTrigger asChild>
    //           <Button variant="ghost" className="h-8 w-8 p-0">
    //             <span className="sr-only">Open menu</span>
    //             <MoreHorizontal className="h-4 w-4" />
    //           </Button>
    //         </DropdownMenuTrigger>

    //         <DropdownMenuContent
    //           align="end"
    //           className="bg-primary border-primary border text-white"
    //         >
    //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //           <DropdownMenuItem
    //             onClick={() => navigator.clipboard.writeText(payment.id)}
    //           >
    //             Copy payment ID
    //           </DropdownMenuItem>
    //           <DropdownMenuSeparator />
    //           <DropdownMenuItem>View customer</DropdownMenuItem>
    //           <DropdownMenuItem>View payment details</DropdownMenuItem>
    //         </DropdownMenuContent>
    //       </DropdownMenu>
    //     )
    //   },
    // },
  ]

  const users = data?.result
  const totalPages = data?.lastPage ?? 0

  return (
    <div className="tbr w-full p-8">
      {users && (
        <CustomTable<UserWithPrivateInfo, string>
          columns={columns}
          data={users}
          totalPages={totalPages}
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          // onSortingChange={setSorting}
          onPaginationChange={(pageIndex, pageSize) =>
            setPagination({ pageIndex, pageSize })
          }
        />
      )}
    </div>
  )
}

export default StatsUsersPage
