import type { ArtifactOfferIdParam } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const getFavorite = async (param: ArtifactOfferIdParam) => {
  const response = await client["town-hall"].offers.favorites[":offerId"].$get({
    param,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
