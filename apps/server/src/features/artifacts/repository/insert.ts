import type { ArtifactSchema } from "@lootopia/common"
import { artifacts, userArtifacts } from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"

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

export const insertDiggedUserArtifact = async (
  userId: string,
  artifactId: string,
  chestId: string
) => {
  return db
    .insert(userArtifacts)
    .values({
      userId,
      artifactId,
      obtainedFromChestId: chestId,
    })
    .onConflictDoNothing()
}
