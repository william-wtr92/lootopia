"use client"

import { useToast } from "@lootopia/ui"
import { useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { useLocale, useTranslations } from "next-intl"
import React, { useState } from "react"

import UserActions from "@client/web/components/features/admin/users/UserActions"
import CustomTable from "@client/web/components/layout/admin/table/CustomTable"
import HeaderCell from "@client/web/components/layout/admin/table/HeaderCell"
import {
  getUsersList,
  type UserWithPrivateInfo,
  type SortingType,
  orderType,
} from "@client/web/services/admin/users/getUsersList"
import { updateUserActive } from "@client/web/services/admin/users/updateUserActive"
import { formatDate } from "@client/web/utils/helpers/formatDate"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

const StatsUsersPage = () => {
  const t = useTranslations("Pages.Admin.Users")
  const locale = useLocale()
  const { toast } = useToast()

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState<SortingType>({
    key: "id",
    type: "asc",
  })
  const [searchValue, setSearchValue] = useState<string>("")

  const { data, refetch } = useQuery({
    queryKey: ["adminUsersList", pagination, sorting, searchValue],
    queryFn: () =>
      getUsersList({
        limit: pagination.pageSize,
        page: pagination.pageIndex,
        search: searchValue,
        sorting,
      }),
  })

  const handleSorting = (key: keyof UserWithPrivateInfo) => {
    setSorting((prevState) => {
      return {
        key: key,
        type: prevState.type === orderType.asc ? orderType.desc : orderType.asc,
      }
    })
  }

  const handleSearchValue = (value: string) => {
    setSearchValue(value)
  }

  const handleUpdateUserActive = async (email: string) => {
    const [status, key] = await updateUserActive(email)

    if (!status) {
      toast({
        variant: "destructive",
        description: translateDynamicKey(t, `errors.${key}`),
      })

      return
    }

    toast({
      variant: "default",
      description: t("success.userActiveUpdate"),
    })

    refetch()
  }

  const columns: ColumnDef<UserWithPrivateInfo>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <HeaderCell<UserWithPrivateInfo>
          column={column}
          handleSorting={handleSorting}
        />
      ),
    },
    {
      accessorKey: "progression.level",
      header: "Level",
    },
    {
      accessorKey: "nickname",
      header: ({ column }) => (
        <HeaderCell<UserWithPrivateInfo>
          column={column}
          handleSorting={handleSorting}
        />
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <HeaderCell<UserWithPrivateInfo>
          column={column}
          handleSorting={handleSorting}
        />
      ),
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
      accessorKey: "active",
      header: "Active",
      cell: ({ row }) => {
        const isActive = row.original.active

        return (
          <span
            className={`block size-[24px] rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}
          ></span>
        )
      },
    },
    {
      id: "Actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original

        return (
          <UserActions
            user={user}
            handleUpdateUserActive={handleUpdateUserActive}
          />
        )
      },
    },
  ]

  const users = data?.result
  const totalPages = data?.lastPage ?? 0
  const paginationValues = {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    totalPages: totalPages,
  }

  return (
    <div className="w-full space-y-8 p-8">
      <h1 className="text-primary text-4xl font-semibold">{t("title")}</h1>

      {users && (
        <CustomTable<UserWithPrivateInfo, string>
          columns={columns}
          data={users}
          paginationValues={paginationValues}
          searchValue={searchValue}
          onPaginationChange={(pageIndex, pageSize) =>
            setPagination({ pageIndex, pageSize })
          }
          handleSearchValue={handleSearchValue}
        />
      )}
    </div>
  )
}

export default StatsUsersPage
