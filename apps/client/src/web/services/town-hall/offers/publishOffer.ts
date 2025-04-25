import type { ArtifactOfferSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const publishOffer = async (body: ArtifactOfferSchema) => {
  const response = await client["town-hall"].offers.$post({
    json: body,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
