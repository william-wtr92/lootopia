import { xpRequired } from "@lootopia/common"
import { userLevels } from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { eq } from "drizzle-orm"

export const updateExperience = async (userId: string, amount: number) => {
  return db.transaction(async (tx) => {
    const [existing] = await tx
      .select()
      .from(userLevels)
      .where(eq(userLevels.userId, userId))

    const currentXP = existing.experience + amount

    let currentLevel = existing.level

    while (currentXP >= xpRequired(currentLevel + 1)) {
      currentLevel++
    }

    await tx
      .update(userLevels)
      .set({ experience: currentXP, level: currentLevel })
      .where(eq(userLevels.userId, userId))

    return {
      newLevel: currentLevel,
      experience: currentXP,
      leveledUp: currentLevel > existing.level,
    }
  })
}
