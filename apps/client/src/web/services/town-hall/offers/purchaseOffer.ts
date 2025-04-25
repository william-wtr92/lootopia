import type { ArtifactOfferIdParam } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const purchaseOffer = async (param: ArtifactOfferIdParam) => {
  const response = await client["town-hall"].offers.buy[":offerId"].$post({
    param,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
