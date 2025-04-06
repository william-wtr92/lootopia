import type { CombinedHuntSchema } from "@lootopia/common"
import { hunts, chests } from "@lootopia/drizzle"
import { db } from "@server/db/client"

export const insertHuntWithChests = async (
  data: CombinedHuntSchema,
  organizerId: string
) => {
  const { hunt: huntData, chests: chestsData } = data

  return db.transaction(async (tx) => {
    const startDate = new Date(huntData.startDate)
    const endDate = new Date(huntData.endDate)

    const [huntInserted] = await tx
      .insert(hunts)
      .values({
        name: huntData.name,
        description: huntData.description,
        city: huntData.city,
        startDate,
        endDate,
        mode: huntData.mode,
        maxParticipants: huntData.maxParticipants,
        organizerId,
      })
      .returning({
        huntId: hunts.id,
      })

    await tx.insert(chests).values(
      chestsData.map((chest) => ({
        position: { x: chest.position.x, y: chest.position.y },
        description: chest.description,
        rewardType: chest.rewardType,
        reward: chest.rewardType === "crown" ? chest.reward?.toString() : null,
        size: chest.size,
        maxUsers: chest.maxUsers,
        visibility: chest.visibility,
        huntId: huntInserted.huntId,
        artifactId:
          chest.rewardType === "artifact" ? chest.reward?.toString() : null,
      }))
    )

    return huntInserted.huntId
  })
}
