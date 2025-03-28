import type { transactionTypes } from "@lootopia/common"
import { crowns, transactions } from "@lootopia/drizzle"
import { db } from "@server/db/client"
import { eq, sql } from "drizzle-orm"

export const updateHuntCrownsTransaction = async (
  type:
    | typeof transactionTypes.huntParticipation
    | typeof transactionTypes.huntCreation,
  huntId: string,
  userId: string,
  amount: number
) => {
  return db.transaction(async (tx) => {
    await tx
      .update(crowns)
      .set({
        amount: sql`${crowns.amount} - ${amount}`,
        updatedAt: new Date(),
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
