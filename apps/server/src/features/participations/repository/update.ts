import { participationRequestStatus } from "@lootopia/common"
import {
  huntParticipationRequests,
  huntParticipations,
} from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { and, eq, sql } from "drizzle-orm"

export const updateRequestAndInsertParticipation = async (
  huntId: string,
  userId: string
) => {
  return db.transaction(async (tx) => {
    await tx
      .update(huntParticipationRequests)
      .set({
        status: participationRequestStatus.APPROVED,
        respondedAt: sql`NOW()`,
      })
      .where(
        and(
          eq(huntParticipationRequests.huntId, huntId),
          eq(huntParticipationRequests.userId, userId)
        )
      )

    await tx.insert(huntParticipations).values({ huntId, userId })
  })
}

export const updateRejectedRequestParticipation = async (
  huntId: string,
  userId: string
) => {
  return db
    .update(huntParticipationRequests)
    .set({
      status: participationRequestStatus.REJECTED,
      respondedAt: sql`NOW()`,
    })
    .where(
      and(
        eq(huntParticipationRequests.huntId, huntId),
        eq(huntParticipationRequests.userId, userId)
      )
    )
}

export const updateParticipationRequestToPending = async (
  requestId: string
) => {
  return db
    .update(huntParticipationRequests)
    .set({
      requestedAt: sql`NOW()`,
      status: participationRequestStatus.PENDING,
      respondedAt: null,
    })
    .where(eq(huntParticipationRequests.id, requestId))
}
