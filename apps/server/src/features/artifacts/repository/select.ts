import type { ArtifactRarity } from "@lootopia/common"
import { artifacts, chests, hunts, userArtifacts } from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { and, count, desc, eq, ilike } from "drizzle-orm"

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
