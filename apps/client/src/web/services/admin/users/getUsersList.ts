import { defaultLimit } from "@common/index"
import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

export const orderType = {
  asc: "asc",
  desc: "desc",
} as const

export type OrderType = keyof typeof orderType

export type SortingType = {
  key: string
  type: OrderType
}

type Query = {
  limit: number
  page: number
  sorting: SortingType
  search?: string
}

const $get = client.admin.users.list.$get
type UserWithPrivateInfoListResponse = InferResponseType<typeof $get>
export type UserWithPrivateInfo = Exclude<
  UserWithPrivateInfoListResponse["result"][number],
  string
>

export const getUsersList = async (query: Query) => {
  const response = await $get({
    query: {
      limit: query.limit?.toString() || defaultLimit.toString(),
      page: query.page.toString(),
      search: query.search,
      sortingKey: query.sorting.key,
      sortingType: query.sorting.type,
    },
  })

  if (response.ok) {
    const data = await response.json()

    return data
  }

  return null
}
