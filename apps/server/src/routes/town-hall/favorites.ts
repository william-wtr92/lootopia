import { zValidator } from "@hono/zod-validator"
import {
  artifactOfferFavoritesSchema,
  artifactOfferIdParam,
  SC,
} from "@lootopia/common"
import {
  artifactOfferMarkedAsFavorite,
  artifactOfferNotFound,
  insertArtifactOfferFavorite,
  deleteArtifactOfferFavorite,
  selectFavoriteByUserIdAndOfferId,
  selectOfferById,
} from "@server/features/town-hall"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const offerFavoritesRoute = app
  .post(
    "/offers/favorites/:offerId",
    zValidator("param", artifactOfferIdParam),
    zValidator("json", artifactOfferFavoritesSchema),
    async (c) => {
      const email = c.get(contextKeys.loggedUserEmail)
      const { offerId } = c.req.param()
      const body = c.req.valid("json")

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const artifactOffer = await selectOfferById(offerId)

      if (!artifactOffer) {
        return c.json(artifactOfferNotFound, SC.errors.NOT_FOUND)
      }

      if (body.favorite) {
        await insertArtifactOfferFavorite(user.id, artifactOffer.id)
      } else {
        await deleteArtifactOfferFavorite(user.id, artifactOffer.id)
      }

      return c.json(artifactOfferMarkedAsFavorite, SC.success.OK)
    }
  )
  .get(
    "/offers/favorites/:offerId",
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

      const isFavorite = await selectFavoriteByUserIdAndOfferId(
        user.id,
        artifactOffer.id
      )

      return c.json(
        {
          result: isFavorite ? true : false,
        },
        SC.success.OK
      )
    }
  )
