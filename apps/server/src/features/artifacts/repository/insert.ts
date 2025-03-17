import type { ArtifactSchema } from "@lootopia/common"
import { artifacts } from "@lootopia/drizzle"
import { db } from "@server/db/client"

export const insertArtifact = async (
  artifact: ArtifactSchema,
  userId: string
) => {
  return db.insert(artifacts).values({
    name: artifact.name,
    shaKey: artifact.shaKey,
    link: artifact.link,
    userId,
  })
}
