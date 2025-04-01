import { zValidator } from "@hono/zod-validator"
import {
  combinedHuntSchema,
  crownCosts,
  MAX_CROWN_REWARD,
  SC,
  transactionTypes,
} from "@lootopia/common"
import {
  artifactNotFound,
  selectArtifactById,
  updateArtifactRarity,
} from "@server/features/artifacts"
import { updateHuntCrownsTransaction } from "@server/features/crowns"
import {
  huntCreatedSuccess,
  insertHuntWithChests,
  maxCrownRewardExceeded,
} from "@server/features/hunts"
import { userNotFound, selectUserByEmail } from "@server/features/users"
import { requiredCrowns } from "@server/middlewares/requiredCrowns"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const createHuntRoute = app.post(
  "/",
  zValidator("json", combinedHuntSchema),
  requiredCrowns(crownCosts.huntCreation),
  async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const body = c.req.valid("json")

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const artifactIdsToUpdate = new Set<string>()

    for (const chest of body.chests) {
      if (chest.rewardType === "crown") {
        if (
          typeof chest.reward === "number" &&
          chest.reward > MAX_CROWN_REWARD
        ) {
          return c.json(maxCrownRewardExceeded, SC.errors.BAD_REQUEST)
        }
      }

      if (chest.rewardType === "artifact") {
        const artifactId = chest.reward.toString()
        const artifact = await selectArtifactById(artifactId)

        if (!artifact) {
          return c.json(artifactNotFound, SC.errors.NOT_FOUND)
        }

        artifactIdsToUpdate.add(artifactId)
      }
    }

    const huntId = await insertHuntWithChests(body, user.id)

    await updateHuntCrownsTransaction(
      transactionTypes.huntCreation,
      huntId,
      user.id,
      crownCosts.huntCreation
    )

    for (const artifactId of artifactIdsToUpdate) {
      await updateArtifactRarity(artifactId)
    }

    return c.json(huntCreatedSuccess, SC.success.CREATED)
  }
)
