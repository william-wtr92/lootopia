import {
  huntParticipationRequests,
  huntParticipations,
} from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { and, eq } from "drizzle-orm"

export const deleteParticipationRequest = async (
  huntId: string,
  userId: string
) => {
  return db
    .delete(huntParticipationRequests)
    .where(
      and(
        eq(huntParticipationRequests.huntId, huntId),
        eq(huntParticipationRequests.userId, userId)
      )
    )
}

export const deleteParticipationAndRequestIfExist = async (
  huntId: string,
  userId: string
) => {
  return db.transaction(async (tx) => {
    await tx
      .delete(huntParticipations)
      .where(
        and(
          eq(huntParticipations.huntId, huntId),
          eq(huntParticipations.userId, userId)
        )
      )

    return tx
      .delete(huntParticipationRequests)
      .where(
        and(
          eq(huntParticipationRequests.huntId, huntId),
          eq(huntParticipationRequests.userId, userId)
        )
      )
  })
}
