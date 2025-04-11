/* eslint-disable camelcase */
import { zValidator } from "@hono/zod-validator"
import {
  calculateDiscountedPrice,
  defaultLimit,
  defaultPage,
  packageIdSchema,
  paymentListParamsSchema,
  SC,
  sessionIdSchema,
} from "@lootopia/common"
import {
  crownPackageNotFound,
  crownPackageStripeError,
  crownPackageStripeSuccess,
  selectCrownPackageById,
  selectPaymentsByUserId,
  selectPaymentsByUserIdCount,
  sessionNotFound,
} from "@server/features/shop"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { stripe } from "@server/utils/clients/stripe"
import {
  buildStripeProductDataName,
  buildStripeReturnUrl,
} from "@server/utils/helpers/stripe"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const paymentsRoute = app
  .post(
    "/checkout/:packageId",
    zValidator("param", packageIdSchema),
    async (c) => {
      const email = c.get(contextKeys.loggedUserEmail)
      const packageId = c.req.param("packageId")

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const crownPackage = await selectCrownPackageById(packageId)

      if (!crownPackage) {
        return c.json(crownPackageNotFound, SC.errors.NOT_FOUND)
      }

      const discountedPrice = calculateDiscountedPrice(
        parseFloat(crownPackage.price),
        crownPackage.discount ?? undefined
      )

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        ui_mode: "embedded",
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: buildStripeProductDataName(crownPackage.crowns),
              },
              unit_amount: Math.round(discountedPrice * 100),
            },
            quantity: 1,
          },
        ],
        return_url: buildStripeReturnUrl(),
        metadata: {
          packageId: crownPackage.id,
          userId: user.id,
        },
      })

      if (!session || !session.client_secret) {
        return c.json(
          crownPackageStripeError,
          SC.serverErrors.INTERNAL_SERVER_ERROR
        )
      }

      return c.json(
        crownPackageStripeSuccess(session.client_secret),
        SC.success.OK
      )
    }
  )
  .get(
    "/session/:sessionId",
    zValidator("param", sessionIdSchema),
    async (c) => {
      const email = c.get(contextKeys.loggedUserEmail)
      const sessionId = c.req.param("sessionId")

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId)

      if (!session || !session.metadata) {
        return c.json(sessionNotFound, SC.errors.NOT_FOUND)
      }

      if (user.id !== session.metadata.userId) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const crownPackage = await selectCrownPackageById(
        session.metadata.packageId
      )

      if (!crownPackage) {
        return c.json(crownPackageNotFound, SC.errors.NOT_FOUND)
      }

      return c.json({ result: crownPackage }, SC.success.OK)
    }
  )
  .get("/payments", zValidator("query", paymentListParamsSchema), async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const { limit: limitString, page: offsetString, search } = c.req.query()

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const limit = parseInt(limitString, 10) || defaultLimit
    const page = parseInt(offsetString, 10) || defaultPage

    const userPayments = await selectPaymentsByUserId(
      user.id,
      limit,
      page,
      search
    )

    const [{ count }] = await selectPaymentsByUserIdCount(user.id, search)

    const lastPage = Math.ceil(count / limit) - 1

    return c.json(
      {
        result: userPayments,
        count,
        lastPage,
      },
      SC.success.OK
    )
  })
