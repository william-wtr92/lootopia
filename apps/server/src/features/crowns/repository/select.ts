import { db } from "@server/utils/clients/postgres"

export const selectCrownsByUserId = async (userId: string) => {
  return db.query.crowns.findFirst({
    where: (crowns, { eq }) => eq(crowns.userId, userId),
  })
}
