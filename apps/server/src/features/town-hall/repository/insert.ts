import { offerStatus, type ArtifactOfferSchema } from "@lootopia/common"
import {
  artifactOfferFavorites,
  artifactOffers,
  artifactOfferViews,
  artifactOwnershipHistory,
} from "@lootopia/drizzle"
import type { InsertArtifactHistory } from "@server/features/town-hall/types"
import { db } from "@server/utils/clients/postgres"
import { offerTime } from "@server/utils/helpers/times"

export const insertArtifactHistory = async (data: InsertArtifactHistory) => {
  return db.insert(artifactOwnershipHistory).values({
    userArtifactId: data.userArtifactId,
    type: data.type,
    previousOwnerId: data.previousOwnerId,
    newOwnerId: data.newOwnerId,
    huntId: data.huntId,
    createdAt: data.createdAt,
    offerId: data.offerId,
  })
}

export const insertArtifactOffer = async (
  userId: string,
  data: ArtifactOfferSchema
) => {
  const [artifactOfferInserted] = await db
    .insert(artifactOffers)
    .values({
      sellerId: userId,
      userArtifactId: data.userArtifactId,
      price: data.price,
      description: data.description ?? null,
      status: offerStatus.active,
      expiresAt: offerTime(data.duration),
    })
    .returning({
      id: artifactOffers.id,
    })

  return artifactOfferInserted
}

export const insertArtifactView = async (userId: string, offerId: string) => {
  return db
    .insert(artifactOfferViews)
    .values({
      viewerId: userId,
      offerId: offerId,
    })
    .onConflictDoNothing()
}

export const insertArtifactOfferFavorite = async (
  userId: string,
  offerId: string
) => {
  return db
    .insert(artifactOfferFavorites)
    .values({
      userId: userId,
      offerId: offerId,
    })
    .onConflictDoNothing()
}
