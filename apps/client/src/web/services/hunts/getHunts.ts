import { defaultLimit, type HuntListQuerySchema } from "@lootopia/common"
import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"
import {
  huntFilterTypeEnum,
  type HuntFilterType,
} from "@client/web/utils/def/huntFilter"

const $get = client.hunts.$get
export type HuntListResponse = InferResponseType<typeof $get>
export type HuntResponse = Exclude<HuntListResponse["result"][number], string>

export const getHunts = async (
  value: string,
  queries: HuntListQuerySchema,
  searchType: HuntFilterType
) => {
  const response = await $get({
    query: {
      limit: queries.limit || defaultLimit.toString(),
      page: queries.page,
      name: searchType === huntFilterTypeEnum.name ? value : undefined,
      city: searchType === huntFilterTypeEnum.city ? value : undefined,
    },
  })

  if (response.ok) {
    const data = await response.json()

    return data
  }

  return null
}
