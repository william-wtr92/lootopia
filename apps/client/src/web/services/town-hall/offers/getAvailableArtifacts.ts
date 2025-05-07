import {
  defaultLimit,
  type ArtifactOfferAvailabilityQuerySchema,
} from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const getAvailableArtifacts = async (
  queries: ArtifactOfferAvailabilityQuerySchema
) => {
  const response = await client["town-hall"].offers.artifacts.available.$get({
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
