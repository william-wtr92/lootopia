import { getRarityFromAvailability } from "@lootopia/common"
import { artifacts, chests } from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { eq, sql } from "drizzle-orm"

export const updateArtifactRarity = async (artifactId: string) => {
  return db.transaction(async (tx) => {
    const result = await tx
      .select({
        availability: sql<number>`SUM(${chests.maxUsers})`,
      })
      .from(chests)
      .where(eq(chests.artifactId, artifactId))

    const availability = result[0]?.availability ?? 0
    const rarity = getRarityFromAvailability(availability)

    await tx
      .update(artifacts)
      .set({
        rarity,
      })
      .where(eq(artifacts.id, artifactId))
  })
}
