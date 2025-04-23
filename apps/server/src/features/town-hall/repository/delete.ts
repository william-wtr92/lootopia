import { artifactOfferFavorites } from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { and, eq } from "drizzle-orm"

export const deleteArtifactOfferFavorite = async (
  userId: string,
  offerId: string
) => {
  return db
    .delete(artifactOfferFavorites)
    .where(
      and(
        eq(artifactOfferFavorites.userId, userId),
        eq(artifactOfferFavorites.offerId, offerId)
      )
    )
}
