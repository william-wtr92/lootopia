import { defaultLimit } from "@common/index"
import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

type Query = {
  limit: number
  page: number
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
    },
  })

  if (response.ok) {
    const data = await response.json()

    return data
  }

  return null
}
