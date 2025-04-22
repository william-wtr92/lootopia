import {
  defaultLimit,
  type ArtifactInventoryQuerySchema,
} from "@lootopia/common"
import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

const $get = client.artifacts.inventory.$get
export type ArtifactInventoryListResponse = InferResponseType<typeof $get>
export type ArtifactInventoryResponse = Exclude<
  ArtifactInventoryListResponse["result"][number],
  string
>

export const getArtifactInventory = async (
  queries: ArtifactInventoryQuerySchema
) => {
  const response = await $get({
    query: {
      search: queries.search,
      limit: queries.limit?.toString() || defaultLimit.toString(),
      page: queries.page.toString(),
      filters: queries.filters,
    },
  })

  if (response.ok) {
    const data = await response.json()

    return data
  }

  return null
}
