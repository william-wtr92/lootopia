import { defaultLimit, type HuntMineListQuerySchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const getOrganizerHunts = async (queries: HuntMineListQuerySchema) => {
  const response = await client.hunts.mine.$get({
    query: {
      search: queries.search,
      limit: queries.limit || defaultLimit.toString(),
      page: queries.page,
    },
  })

  if (response.ok) {
    const data = await response.json()

    return data
  }

  return null
}
