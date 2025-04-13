import {
  defaultLimit,
  type HuntIdSchema,
  type ParticipationRequestsParamsSchema,
} from "@lootopia/common"
import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

const $get = client.hunts.participate[":huntId"].requests.$get
export type RequestListResponse = InferResponseType<typeof $get>
export type RequestResponse = Exclude<
  RequestListResponse["result"][number],
  string
>

export const getParticipationRequestList = async (
  huntId: HuntIdSchema,
  queries: ParticipationRequestsParamsSchema
) => {
  const response = await $get({
    param: huntId,
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
