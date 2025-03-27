import { db } from "@server/db/client"

export const selectCrownsByUserId = async (userId: string) => {
  return db.query.crowns.findFirst({
    where: (crowns, { eq }) => eq(crowns.userId, userId),
  })
}
