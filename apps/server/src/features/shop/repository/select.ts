import { db } from "@server/utils/clients/postgres"

export const selectCrownsPackages = async () => {
  return db.query.crownPackages.findMany()
}

export const selectCrownPackageById = async (id: string) => {
  return db.query.crownPackages.findFirst({
    where: (crownPackages, { eq }) => eq(crownPackages.id, id),
  })
}
