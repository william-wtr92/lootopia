import { defaultLimit, type UserSearchQuerySchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const getUserList = async (queries: UserSearchQuerySchema) => {
  const response = await client.users.search.$get({
    query: {
      search: queries.search,
      limit: queries.limit?.toString() || defaultLimit.toString(),
      page: queries.page.toString(),
    },
  })

  if (response.ok) {
    const data = await response.json()

    return data
  }

  return null
}
