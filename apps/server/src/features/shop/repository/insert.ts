import { payments } from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import type Stripe from "stripe"

export const insertPayment = async (
  userId: string,
  crownPackageId: string,
  data: Stripe.Checkout.Session
) => {
  return db.insert(payments).values({
    userId,
    crownPackageId,
    amount: data.amount_total ? (data.amount_total / 100).toFixed(2) : "0.00",
    providerPaymentId: data.id,
    status: data.payment_status ?? "unknown",
  })
}
