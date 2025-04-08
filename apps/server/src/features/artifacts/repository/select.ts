import { db } from "@server/utils/clients/postgres"

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
