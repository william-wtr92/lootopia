"use client"

import {
  defaultLimit,
  defaultPage,
  orderType,
  type SortingType,
} from "@lootopia/common"
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
} from "@client/web/services/admin/users/getUsersList"
import { updateUserActive } from "@client/web/services/admin/users/updateUserActive"
import { formatDate } from "@client/web/utils/helpers/formatDate"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

const StatsUsersPage = () => {
  const t = useTranslations("Pages.Admin.Users")
  const locale = useLocale()
  const { toast } = useToast()

  const [pagination, setPagination] = useState({
    pageIndex: defaultPage,
    pageSize: defaultLimit,
  })
  const [sorting, setSorting] = useState<SortingType>({
    key: "id",
    type: "asc",
  })
  const [searchValue, setSearchValue] = useState<string>("")

  const { data, refetch } = useQuery({
    queryKey: ["adminUsersList", pagination, sorting, searchValue],
    queryFn: () =>
      getUsersList({
        limit: pagination.pageSize.toString(),
        page: pagination.pageIndex.toString(),
        search: searchValue,
        sortingKey: sorting.key,
        sortingType: sorting.type,
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
    const [status, key] = await updateUserActive({ email })

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
          name={t("headers.id")}
          column={column}
          handleSorting={handleSorting}
        />
      ),
    },
    {
      accessorKey: "progression.level",
      header: t("headers.level"),
    },
    {
      accessorKey: "nickname",
      header: ({ column }) => (
        <HeaderCell<UserWithPrivateInfo>
          name={t("headers.nickname")}
          column={column}
          handleSorting={handleSorting}
        />
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <HeaderCell<UserWithPrivateInfo>
          name={t("headers.email")}
          column={column}
          handleSorting={handleSorting}
        />
      ),
    },
    {
      accessorKey: "phone",
      header: t("headers.phone"),
    },
    {
      accessorKey: "birthdate",
      header: t("headers.birthdate"),
      cell: ({ row }) => formatDate(row.original.birthdate, locale),
    },
    {
      accessorKey: "active",
      header: t("headers.active"),
      cell: ({ row }) => {
        const isActive = row.original.active

        return (
          <span
            className={`block size-[24px] rounded-full ${isActive ? "bg-success" : "bg-error"}`}
          ></span>
        )
      },
    },
    {
      id: "Actions",
      header: t("headers.actions"),
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
