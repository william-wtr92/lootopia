import { offerStatus, type ArtifactOfferSchema } from "@lootopia/common"
import { artifactOffers, artifactOwnershipHistory } from "@lootopia/drizzle"
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
    transferredAt: data.transferredAt,
  })
}

export const insertArtifactOffer = async (
  userId: string,
  data: ArtifactOfferSchema
) => {
  return db.insert(artifactOffers).values({
    sellerId: userId,
    userArtifactId: data.userArtifactId,
    price: data.price,
    description: data.description ?? null,
    status: offerStatus.active,
    expiresAt: offerTime(data.duration),
  })
}
