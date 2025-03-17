import { defaultLimit } from "@lootopia/common"

import { client } from "@client/web/utils/client"
import {
  huntFilterTypeEnum,
  type HuntFilterType,
} from "@client/web/utils/def/huntFilter"

export const getHunts = async (
  value: string,
  searchType: HuntFilterType,
  pageParam: number
) => {
  const response = await client.hunts.$get({
    query: {
      limit: defaultLimit,
      page: pageParam,
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
