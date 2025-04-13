import type { HuntSchema } from "@lootopia/common"
import { hunts } from "@lootopia/drizzle"
import type { Hunt } from "@server/features/hunts/types"
import { db } from "@server/utils/clients/postgres"
import { getUpdateValue } from "@server/utils/helpers/getUpdatedValue"
import { eq } from "drizzle-orm"

export const updateHunt = async (hunt: Hunt, updatedHunt: HuntSchema) => {
  await db
    .update(hunts)
    .set({
      ...getUpdateValue<Hunt>(
        updatedHunt.name !== hunt.name,
        "name",
        updatedHunt.name
      ),
      ...getUpdateValue<Hunt>(
        updatedHunt.description !== hunt.description,
        "description",
        updatedHunt.description
      ),
      ...getUpdateValue<Hunt>(
        updatedHunt.city !== hunt.city,
        "city",
        updatedHunt.city
      ),
      ...getUpdateValue<Hunt>(
        new Date(updatedHunt.startDate).getTime() !==
          new Date(hunt.startDate).getTime(),
        "startDate",
        new Date(updatedHunt.startDate)
      ),
      ...getUpdateValue<Hunt>(
        new Date(updatedHunt.endDate).getTime() !==
          new Date(hunt.endDate).getTime(),
        "endDate",
        new Date(updatedHunt.endDate)
      ),
      ...getUpdateValue<Hunt>(
        updatedHunt.public !== hunt.public,
        "public",
        updatedHunt.public
      ),
      ...getUpdateValue<Hunt>(
        updatedHunt.maxParticipants !== hunt.maxParticipants,
        "maxParticipants",
        updatedHunt.maxParticipants ?? null
      ),
      updatedAt: new Date(),
    })
    .where(eq(hunts.id, hunt.id))
}
