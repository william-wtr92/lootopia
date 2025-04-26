import { zValidator } from "@hono/zod-validator"
import {
  artifactOfferAvailabilityQuerySchema,
  artifactOfferIdParam,
  artifactOfferSchema,
  artifactOffersQuerySchema,
  defaultLimit,
  defaultPage,
  historyStatus,
  MINIMUM_OFFER_PRICE,
  SC,
  transactionTypes,
  XP_REWARDS,
  type ArtifactRarity,
  type OfferFilters,
} from "@lootopia/common"
import {
  selectUserArtifactByIdAndUserId,
  userArtifactNotFound,
} from "@server/features/artifacts"
import {
  notEnoughCrowns,
  updateOfferPurchaseTransaction,
  updateOfferSellerTransaction,
} from "@server/features/crowns"
import { updateExperience } from "@server/features/progressions"
import {
  insertArtifactHistory,
  insertArtifactOffer,
  artifactOfferCreated,
  artifactOfferAlreadyExists,
  artifactOfferNotFound,
  selectArtifactOffers,
  selectOfferById,
  selectUserArtifactAvailableForOffer,
  selectUserArtifactOfferByUserArtifactId,
  updateUserArtifactOwnership,
  artifactOfferPurchased,
  sellerCantBeBuyer,
  artifactOfferPriceTooLow,
  selectCompleteOfferById,
} from "@server/features/town-hall"
import {
  selectUserByEmail,
  selectUserWithCrownsAndProgression,
  userNotFound,
} from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const offersRoute = app
  .post("/offers", zValidator("json", artifactOfferSchema), async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const body = c.req.valid("json")

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    if (body.price < MINIMUM_OFFER_PRICE) {
      return c.json(artifactOfferPriceTooLow, SC.errors.BAD_REQUEST)
    }

    const userArtifact = await selectUserArtifactByIdAndUserId(
      user.id,
      body.userArtifactId
    )

    if (!userArtifact) {
      return c.json(userArtifactNotFound, SC.errors.NOT_FOUND)
    }

    const artifactOffer = await selectUserArtifactOfferByUserArtifactId(
      user.id,
      body.userArtifactId
    )

    if (artifactOffer) {
      return c.json(artifactOfferAlreadyExists, SC.errors.BAD_REQUEST)
    }

    const artifactOfferInserted = await insertArtifactOffer(user.id, {
      userArtifactId: body.userArtifactId,
      price: body.price,
      description: body.description,
      duration: body.duration,
    })

    await insertArtifactHistory({
      userArtifactId: body.userArtifactId,
      type: historyStatus.listing,
      previousOwnerId: user.id,
      offerId: artifactOfferInserted.id,
    })

    return c.json(artifactOfferCreated, SC.success.OK)
  })
  .get(
    "/offers/available/artifacts",
    zValidator("query", artifactOfferAvailabilityQuerySchema),
    async (c) => {
      const email = c.get(contextKeys.loggedUserEmail)
      const { limit: limitString, page: offsetString, search } = c.req.query()

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const limit = parseInt(limitString, 10) || defaultLimit
      const page = parseInt(offsetString, 10) || defaultPage

      const [artifactsAvailable, countResult] =
        await selectUserArtifactAvailableForOffer(user.id, limit, page, search)

      const lastPage = Math.ceil(countResult / limit) - 1

      return c.json({ result: artifactsAvailable, lastPage }, SC.success.OK)
    }
  )
  .get("/offers", zValidator("query", artifactOffersQuerySchema), async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const {
      limit: limitString,
      page: offsetString,
      search,
      filters,
      minPrice,
      maxPrice,
      sortBy,
    } = c.req.query()

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const limit = parseInt(limitString, 10) || defaultLimit
    const page = parseInt(offsetString, 10) || defaultPage

    const [offers, countResult] = await selectArtifactOffers(
      limit,
      page,
      user.id,
      {
        search,
        filters: filters as ArtifactRarity,
        minPrice,
        maxPrice,
        sortBy: sortBy as OfferFilters,
      }
    )

    const lastPage = Math.ceil(countResult / limit) - 1

    return c.json({ result: offers, countResult, lastPage }, SC.success.OK)
  })
  .post(
    "/offers/buy/:offerId",
    zValidator("param", artifactOfferIdParam),
    async (c) => {
      const email = c.get(contextKeys.loggedUserEmail)
      const { offerId } = c.req.param()

      const user = await selectUserWithCrownsAndProgression(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const artifactOffer = await selectOfferById(offerId)

      if (!artifactOffer) {
        return c.json(artifactOfferNotFound, SC.errors.NOT_FOUND)
      }

      if (artifactOffer.sellerId === user.id) {
        return c.json(sellerCantBeBuyer, SC.errors.BAD_REQUEST)
      }

      if (user?.crowns === null || user.crowns < artifactOffer.price) {
        return c.json(notEnoughCrowns, SC.errors.BAD_REQUEST)
      }

      await updateUserArtifactOwnership(
        user.id,
        artifactOffer.sellerId,
        artifactOffer.userArtifactId,
        offerId
      )

      await updateOfferPurchaseTransaction(
        transactionTypes.offerPurchase,
        user.id,
        offerId,
        artifactOffer.price
      )

      await updateOfferSellerTransaction(
        transactionTypes.offerPayment,
        artifactOffer.sellerId,
        offerId,
        artifactOffer.price
      )

      await updateExperience(user.id, XP_REWARDS.artifactOfferPurchase)
      await updateExperience(
        artifactOffer.sellerId,
        XP_REWARDS.artifactOfferSold
      )

      return c.json(artifactOfferPurchased, SC.success.OK)
    }
  )
  .get(
    "/offers/find/:offerId",
    zValidator("param", artifactOfferIdParam),
    async (c) => {
      const email = c.get(contextKeys.loggedUserEmail)
      const offerId = c.req.param("offerId")

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const artifactOffer = await selectCompleteOfferById(offerId)

      if (!artifactOffer) {
        return c.json(artifactOfferNotFound, SC.errors.NOT_FOUND)
      }

      return c.json({ result: artifactOffer }, SC.success.OK)
    }
  )
