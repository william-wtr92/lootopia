import type { ArtifactOfferIdParam } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const cancelOffer = async (param: ArtifactOfferIdParam) => {
  const response = await client["town-hall"].offers.cancel[":offerId"].$put({
    param,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
