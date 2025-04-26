import { historyStatus, offerStatus } from "@lootopia/common"
import {
  artifactOfferFavorites,
  artifactOffers,
  artifactOfferViews,
  artifactOwnershipHistory,
  userArtifacts,
} from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { eq, sql } from "drizzle-orm"

export const updateUserArtifactOwnership = async (
  userId: string,
  sellerId: string,
  userArtifactId: string,
  offerId: string
) => {
  return db.transaction(async (tx) => {
    await tx
      .update(userArtifacts)
      .set({
        userId,
      })
      .where(eq(userArtifacts.id, userArtifactId))

    await tx
      .update(artifactOffers)
      .set({
        status: offerStatus.sold,
        expiresAt: sql`NOW()`,
      })
      .where(eq(artifactOffers.id, offerId))

    await tx.insert(artifactOwnershipHistory).values({
      userArtifactId,
      type: historyStatus.transfer,
      previousOwnerId: sellerId,
      newOwnerId: userId,
      offerId,
    })
  })
}

export const updateArtifactOfferState = async (offerId: string) => {
  return db.transaction(async (tx) => {
    await tx
      .update(artifactOffers)
      .set({
        status: offerStatus.cancelled,
      })
      .where(eq(artifactOffers.id, offerId))

    await tx
      .delete(artifactOfferViews)
      .where(eq(artifactOfferViews.offerId, offerId))

    await tx
      .delete(artifactOfferFavorites)
      .where(eq(artifactOfferFavorites.offerId, offerId))
  })
}
