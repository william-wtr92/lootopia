import type {
  ArtifactOfferIdParam,
  ArtifactOfferFavoritesSchema,
} from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const addToFavorites = async (
  param: ArtifactOfferIdParam,
  body: ArtifactOfferFavoritesSchema
) => {
  const response = await client["town-hall"].offers.favorites[":offerId"].$post(
    {
      param,
      json: body,
    }
  )

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
