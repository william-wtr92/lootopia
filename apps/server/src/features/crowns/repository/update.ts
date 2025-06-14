import { offerPaymentFee, type transactionTypes } from "@lootopia/common"
import { crowns, transactions } from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { eq, sql } from "drizzle-orm"

export const updateHuntCrownsTransaction = async (
  type:
    | typeof transactionTypes.huntParticipation
    | typeof transactionTypes.huntCreation
    | typeof transactionTypes.hintPurchase,
  huntId: string,
  userId: string,
  amount: number
) => {
  return db.transaction(async (tx) => {
    await tx
      .update(crowns)
      .set({
        amount: sql`${crowns.amount} - ${amount}`,
        updatedAt: sql`NOW()`,
      })
      .where(eq(crowns.userId, userId))

    await tx.insert(transactions).values({
      type,
      amount: -amount,
      huntId,
      userId,
    })
  })
}

export const updateCrownsShop = async (userId: string, amount: number) => {
  return db
    .update(crowns)
    .set({
      amount: sql`${crowns.amount} + ${amount}`,
      updatedAt: new Date(),
    })
    .where(eq(crowns.userId, userId))
}

export const updateDiggedCrownsTransaction = async (
  type: typeof transactionTypes.huntDigging,
  huntId: string,
  userId: string,
  amount: number
) => {
  return db.transaction(async (tx) => {
    await tx
      .update(crowns)
      .set({
        amount: sql`${crowns.amount} + ${amount}`,
        updatedAt: sql`NOW()`,
      })
      .where(eq(crowns.userId, userId))

    await tx.insert(transactions).values({
      type,
      amount,
      huntId,
      userId,
    })
  })
}

export const updateOfferPurchaseTransaction = async (
  type: typeof transactionTypes.offerPurchase,
  userId: string,
  artifactOfferId: string,
  amount: number
) => {
  return db.transaction(async (tx) => {
    await tx
      .update(crowns)
      .set({
        amount: sql`${crowns.amount} - ${amount}`,
        updatedAt: sql`NOW()`,
      })
      .where(eq(crowns.userId, userId))

    await tx.insert(transactions).values({
      type,
      amount: -amount,
      userId,
      artifactOfferId,
    })
  })
}

export const updateOfferSellerTransaction = async (
  type: typeof transactionTypes.offerPayment,
  userId: string,
  artifactOfferId: string,
  amount: number
) => {
  const newAmount = Math.ceil(amount - amount * (offerPaymentFee / 100))

  return db.transaction(async (tx) => {
    await tx
      .update(crowns)
      .set({
        amount: sql`${crowns.amount} + ${newAmount}`,
        updatedAt: sql`NOW()`,
      })
      .where(eq(crowns.userId, userId))

    await tx.insert(transactions).values({
      type,
      amount: newAmount,
      userId,
      artifactOfferId,
    })
  })
}
