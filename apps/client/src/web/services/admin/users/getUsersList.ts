import { type UsersListQuerySchema, defaultLimit } from "@lootopia/common"
import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

const $get = client.admin.users.list.$get
type UserWithPrivateInfoListResponse = InferResponseType<typeof $get>
export type UserWithPrivateInfo = Exclude<
  UserWithPrivateInfoListResponse["result"][number],
  string
>

export const getUsersList = async (query: UsersListQuerySchema) => {
  const response = await $get({
    query: {
      limit: query.limit || defaultLimit.toString(),
      page: query.page.toString(),
      search: query.search,
      sortingKey: query.sortingKey,
      sortingType: query.sortingType,
    },
  })

  if (response.ok) {
    const data = await response.json()

    return data
  }

  return null
}
