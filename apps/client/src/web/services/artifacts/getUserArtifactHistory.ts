import {
  defaultLimit,
  type ArtifactHistoryQuerySchema,
  type UserArtifactParamSchema,
} from "@lootopia/common"
import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

const $get = client.artifacts.history[":userArtifactId"].$get
type UserArtifactHistoryResponse = InferResponseType<typeof $get>
export type ArtifactHistoryResponse = Exclude<
  UserArtifactHistoryResponse["result"][number],
  string
>

export const getUserArtifactHistory = async (
  param: UserArtifactParamSchema,
  queries: ArtifactHistoryQuerySchema
) => {
  const response = await $get({
    param,
    query: {
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
