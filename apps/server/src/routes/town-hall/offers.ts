import { zValidator } from "@hono/zod-validator"
import { artifactOfferSchema, historyStatus, SC } from "@lootopia/common"
import {
  selectUserArtifactById,
  userArtifactNotFound,
} from "@server/features/artifacts"
import {
  insertArtifactHistory,
  insertArtifactOffer,
  artifactOfferCreated,
} from "@server/features/town-hall"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const offersRoute = app.post(
  "/offers",
  zValidator("json", artifactOfferSchema),
  async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const body = c.req.valid("json")

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const userArtifact = await selectUserArtifactById(
      user.id,
      body.userArtifactId
    )

    if (!userArtifact) {
      return c.json(userArtifactNotFound, SC.errors.NOT_FOUND)
    }

    await insertArtifactOffer(user.id, {
      userArtifactId: body.userArtifactId,
      price: body.price,
      description: body.description,
      duration: body.duration,
    })

    await insertArtifactHistory({
      userArtifactId: body.userArtifactId,
      type: historyStatus.listing,
      previousOwnerId: user.id,
    })

    return c.json(artifactOfferCreated, SC.success.OK)
  }
)
