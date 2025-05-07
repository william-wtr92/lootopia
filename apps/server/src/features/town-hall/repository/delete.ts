import { artifactOfferFavorites, artifactOfferViews } from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { and, eq, inArray } from "drizzle-orm"

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

export const deleteViewsForExpiredOffers = async (
  expiredOfferIds: string[]
) => {
  if (expiredOfferIds.length === 0) {
    return
  }

  return db
    .delete(artifactOfferViews)
    .where(inArray(artifactOfferViews.offerId, expiredOfferIds))
}

export const deleteFavoritesForExpiredOffers = async (
  expiredOfferIds: string[]
) => {
  if (expiredOfferIds.length === 0) {
    return
  }

  return db
    .delete(artifactOfferFavorites)
    .where(inArray(artifactOfferFavorites.offerId, expiredOfferIds))
}
