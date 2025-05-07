import { zValidator } from "@hono/zod-validator"
import { artifactOfferIdParam, SC } from "@lootopia/common"
import {
  artifactOfferNotFound,
  artifactOfferViewed,
  insertArtifactView,
  selectOfferById,
} from "@server/features/town-hall"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const offerViewsRoute = app.post(
  "/offers/views/:offerId",
  zValidator("param", artifactOfferIdParam),
  async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const { offerId } = c.req.param()

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const artifactOffer = await selectOfferById(offerId)

    if (!artifactOffer) {
      return c.json(artifactOfferNotFound, SC.errors.NOT_FOUND)
    }

    await insertArtifactView(user.id, artifactOffer.id)

    return c.json(artifactOfferViewed, SC.success.OK)
  }
)
