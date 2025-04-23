import type { ArtifactRarity } from "@lootopia/common"
import {
  artifactOffers,
  artifactOwnershipHistory,
  artifacts,
  chests,
  hunts,
  userArtifacts,
  users,
} from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { and, count, desc, eq, ilike } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

export const selectArtifactByShaKey = async (shaKey: string) => {
  return db.query.artifacts.findFirst({
    where: (artifacts, { eq }) => eq(artifacts.shaKey, shaKey),
  })
}

export const selectArtifactsByUserId = async (userId: string) => {
  return db.query.artifacts.findMany({
    where: (artifacts, { eq }) => eq(artifacts.userId, userId),
  })
}

export const selectArtifactById = async (artifactId: string) => {
  return db.query.artifacts.findFirst({
    where: (artifacts, { eq }) => eq(artifacts.id, artifactId),
  })
}

export const selectUserArtifact = async (
  userId: string,
  limit: number,
  page: number,
  search?: string,
  filters?: ArtifactRarity
) => {
  return db
    .select({
      artifact: artifacts,
      userArtifactId: userArtifacts.id,
      huntName: hunts.name,
      obtainedAt: userArtifacts.obtainedAt,
    })
    .from(userArtifacts)
    .where(
      and(
        eq(userArtifacts.userId, userId),
        search ? ilike(artifacts.name, `%${search}%`) : undefined,
        filters ? eq(artifacts.rarity, filters) : undefined
      )
    )
    .leftJoin(artifacts, eq(userArtifacts.artifactId, artifacts.id))
    .leftJoin(chests, eq(userArtifacts.obtainedFromChestId, chests.id))
    .leftJoin(hunts, eq(chests.huntId, hunts.id))
    .limit(limit)
    .offset(page * limit)
    .orderBy(desc(userArtifacts.obtainedAt))
}

export const selectUserArtifactCount = async (userId: string) => {
  return db
    .select({ count: count() })
    .from(userArtifacts)
    .where(eq(userArtifacts.userId, userId))
}

export const selectUserArtifactById = async (userArtifactId: string) => {
  return db.query.userArtifacts.findFirst({
    where: (userArtifacts, { eq }) => eq(userArtifacts.id, userArtifactId),
  })
}

export const selectUserArtifactByIdAndUserId = async (
  userId: string,
  userArtifactId: string
) => {
  return db.query.userArtifacts.findFirst({
    where: (userArtifacts, { eq }) =>
      and(
        eq(userArtifacts.userId, userId),
        eq(userArtifacts.id, userArtifactId)
      ),
  })
}

export const selectArtifactHistory = async (
  limit: number,
  page: number,
  userArtifactId: string
) => {
  const previousUser = alias(users, "previousUser")
  const newUser = alias(users, "newUser")

  const [history, countResult] = await Promise.all([
    db
      .select({
        id: artifactOwnershipHistory.id,
        type: artifactOwnershipHistory.type,
        createdAt: artifactOwnershipHistory.createdAt,
        previousOwner: previousUser.nickname,
        newOwner: newUser.nickname,
        price: artifactOffers.price,
        huntCity: hunts.city,
      })
      .from(artifactOwnershipHistory)
      .where(eq(artifactOwnershipHistory.userArtifactId, userArtifactId))
      .leftJoin(
        previousUser,
        eq(artifactOwnershipHistory.previousOwnerId, previousUser.id)
      )
      .leftJoin(newUser, eq(artifactOwnershipHistory.newOwnerId, newUser.id))
      .leftJoin(
        artifactOffers,
        eq(artifactOwnershipHistory.offerId, artifactOffers.id)
      )
      .leftJoin(hunts, eq(artifactOwnershipHistory.huntId, hunts.id))
      .orderBy(desc(artifactOwnershipHistory.createdAt))
      .limit(limit)
      .offset(page * limit),

    db
      .select({ count: count() })
      .from(artifactOwnershipHistory)
      .where(eq(artifactOwnershipHistory.userArtifactId, userArtifactId)),
  ])

  return [history, countResult[0].count] as const
}
