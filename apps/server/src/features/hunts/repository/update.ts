import type { HuntSchema } from "@lootopia/common"
import { chests, hunts } from "@lootopia/drizzle"
import { db } from "@server/db/client"
import type { Hunt } from "@server/features/hunts/types"
import { and, eq } from "drizzle-orm"

export const updateHunt = async (hunt: Hunt, updatedHunt: HuntSchema) => {
  await db
    .update(hunts)
    .set({
      ...(updatedHunt.name !== hunt.name ? { name: updatedHunt.name } : {}),
      ...(updatedHunt.description !== hunt.description
        ? { description: updatedHunt.description }
        : {}),
      ...(updatedHunt.city !== hunt.city ? { city: updatedHunt.city } : {}),
      ...(new Date(updatedHunt.startDate).getTime() !==
      new Date(hunt.startDate).getTime()
        ? { startDate: new Date(updatedHunt.startDate) }
        : {}),
      ...(new Date(updatedHunt.endDate).getTime() !==
      new Date(hunt.endDate).getTime()
        ? { endDate: new Date(updatedHunt.endDate) }
        : {}),
      ...(updatedHunt.mode !== hunt.mode ? { mode: updatedHunt.mode } : {}),
      ...(updatedHunt.maxParticipants !== hunt.maxParticipants
        ? { maxParticipants: updatedHunt.maxParticipants }
        : {}),
      updatedAt: new Date(),
    })
    .where(eq(hunts.id, hunt.id))
}

export const updateHuntChestDigged = async (
  huntId: string,
  chestId: string,
  maxUsers: number
) => {
  return db
    .update(chests)
    .set({
      maxUsers: maxUsers - 1,
      updatedAt: new Date(),
    })
    .where(and(eq(chests.huntId, huntId), eq(chests.id, chestId)))
}
