import { zValidator } from "@hono/zod-validator"
import { SC, stripeSignatureSchema } from "@lootopia/common"
import appConfig from "@server/config"
import { updateCrownsShop } from "@server/features/crowns"
import {
  crownPackageNotFound,
  insertPayment,
  paymentRegisteredSuccess,
  selectCrownPackageById,
  sessionMetadataError,
  webhookSignatureError,
} from "@server/features/shop"
import { selectUserById, userNotFound } from "@server/features/users"
import { stripe } from "@server/utils/clients/stripe"
import { Hono } from "hono"
import type Stripe from "stripe"

const app = new Hono()

export const webhookRoute = app.post(
  "/webhook",
  zValidator("header", stripeSignatureSchema),
  async (c) => {
    const sig = c.req.header("stripe-signature")
    const bodyBuffer = await c.req.arrayBuffer()

    const body = Buffer.from(bodyBuffer)

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig!,
        appConfig.stripe.webhook
      )
    } catch {
      return c.json(webhookSignatureError, SC.errors.BAD_REQUEST)
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      if (!session.metadata) {
        return c.json(sessionMetadataError, SC.errors.BAD_REQUEST)
      }

      const user = await selectUserById(session.metadata.userId)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const crownPackage = await selectCrownPackageById(
        session.metadata.packageId
      )

      if (!crownPackage) {
        return c.json(crownPackageNotFound, SC.errors.NOT_FOUND)
      }

      insertPayment(user.id, crownPackage.id, session)

      const totalCrowns = crownPackage.crowns + (crownPackage.bonus ?? 0)
      updateCrownsShop(user.id, totalCrowns)
    }

    return c.json(paymentRegisteredSuccess, SC.success.OK)
  }
)
