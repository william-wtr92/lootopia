import { type ArtifactOffersQuerySchema, defaultLimit } from "@lootopia/common"
import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

const $get = client["town-hall"].offers.$get
export type ArtifactOffersListResponse = InferResponseType<typeof $get>
export type ArtifactOffersResponse = Exclude<
  ArtifactOffersListResponse["result"][number],
  string
>

export const getOffers = async (queries: ArtifactOffersQuerySchema) => {
  const response = await $get({
    query: {
      search: queries.search,
      limit: queries.limit?.toString() || defaultLimit.toString(),
      page: queries.page.toString(),
      filters: queries.filters,
      minPrice: queries.minPrice?.toString(),
      maxPrice: queries.maxPrice?.toString(),
      sortBy: queries.sortBy,
    },
  })

  if (response.ok) {
    const data = await response.json()

    return data
  }

  return null
}
