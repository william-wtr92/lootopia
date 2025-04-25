import type { ArtifactOfferIdParam } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const viewOffer = async (param: ArtifactOfferIdParam) => {
  const response = await client["town-hall"].offers.views[":offerId"].$post({
    param,
  })

  if (response.ok) {
    const data = await response.json()

    return data
  }

  return null
}
