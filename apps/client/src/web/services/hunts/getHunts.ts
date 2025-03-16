import { defaultLimit } from "@lootopia/common"

import { huntFilterTypeEnum } from "@client/app/[locale]/hunts/(list)/list/page"
import { client } from "@client/web/utils/client"

export const getHunts = async (
  value: string,
  searchType: string,
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
