import {
  participationRequestStatus,
  type HuntParticipationStatusQuery,
} from "@lootopia/common"
import {
  huntParticipationRequests,
  huntParticipations,
  hunts,
  users,
} from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { and, asc, count, eq, gte, ilike, inArray, lt } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

export const selectParticipantsByHuntId = async (huntId: string) => {
  return db
    .select()
    .from(huntParticipations)
    .where(eq(huntParticipations.huntId, huntId))
}

export const selectParticipantsByHuntIdCount = async (huntId: string) => {
  return db
    .select({ count: count() })
    .from(huntParticipations)
    .where(eq(huntParticipations.huntId, huntId))
}

export const selectParticipationRequestByHuntIdAndUserId = async (
  huntId: string,
  userId: string
) => {
  return db.query.huntParticipationRequests.findFirst({
    where: (huntParticipationRequests, { eq, and }) =>
      and(
        eq(huntParticipationRequests.userId, userId),
        eq(huntParticipationRequests.huntId, huntId)
      ),
  })
}

export const selectParticipationRequestByHuntIdAndRequestId = async (
  huntId: string,
  requestId: string
) => {
  return db.query.huntParticipationRequests.findFirst({
    where: (huntParticipationRequests, { eq, and }) =>
      and(
        eq(huntParticipationRequests.id, requestId),
        eq(huntParticipationRequests.huntId, huntId)
      ),
  })
}

export const selectParticipationRequestsByHuntId = async (
  huntId: string,
  limit: number,
  page: number,
  search: string
) => {
  const requester = alias(users, "requester")

  return db
    .select({
      request: huntParticipationRequests,
      requesterUser: {
        nickname: requester.nickname,
        avatar: requester.avatar,
      },
    })
    .from(huntParticipationRequests)
    .leftJoin(requester, eq(huntParticipationRequests.userId, requester.id))
    .where(
      and(
        eq(huntParticipationRequests.huntId, huntId),
        eq(
          huntParticipationRequests.status,
          participationRequestStatus.PENDING
        ),
        search ? ilike(requester.nickname, `%${search}%`) : undefined
      )
    )
    .orderBy(asc(huntParticipationRequests.requestedAt))
    .limit(limit)
    .offset(limit * page)
}

export const selectParticipationRequestsByHuntIdCount = async (
  huntId: string,
  search?: string
) => {
  const requester = alias(users, "requester")

  return db
    .select({ count: count() })
    .from(huntParticipationRequests)
    .leftJoin(requester, eq(huntParticipationRequests.userId, requester.id))
    .where(
      and(
        eq(huntParticipationRequests.huntId, huntId),
        eq(
          huntParticipationRequests.status,
          participationRequestStatus.PENDING
        ),
        search ? ilike(requester.nickname, `%${search}%`) : undefined
      )
    )
}

export const selectParticipationsByHuntIds = async (
  huntIds: string[],
  userId: string
) => {
  if (!huntIds.length) {
    return []
  }

  return await db
    .select({
      huntId: huntParticipations.huntId,
    })
    .from(huntParticipations)
    .where(
      and(
        eq(huntParticipations.userId, userId),
        inArray(huntParticipations.huntId, huntIds)
      )
    )
}

export const selectParticipationRequestsByHuntIds = async (
  huntIds: string[],
  userId: string
) => {
  if (!huntIds.length) {
    return []
  }

  return await db
    .select({
      huntId: huntParticipationRequests.huntId,
      status: huntParticipationRequests.status,
    })
    .from(huntParticipationRequests)
    .where(
      and(
        eq(huntParticipationRequests.userId, userId),
        inArray(huntParticipationRequests.huntId, huntIds)
      )
    )
}

export const selectHuntsWhereUserParticipates = async (
  userId: string,
  limit: number,
  page: number,
  search?: string,
  status?: HuntParticipationStatusQuery
) => {
  const now = new Date()

  return db
    .select()
    .from(hunts)
    .innerJoin(huntParticipations, eq(hunts.id, huntParticipations.huntId))
    .where(
      and(
        eq(huntParticipations.userId, userId),
        search ? ilike(hunts.name, `%${search}%`) : undefined,
        status === "started"
          ? lt(hunts.startDate, now)
          : status === "upcoming"
            ? gte(hunts.startDate, now)
            : undefined
      )
    )
    .limit(limit)
    .offset(limit * page)
}
export const selectHuntsWhereUserParticipatesCount = async (
  userId: string,
  search?: string,
  status?: HuntParticipationStatusQuery
) => {
  const now = new Date()

  return db
    .select({ count: count() })
    .from(hunts)
    .innerJoin(huntParticipations, eq(hunts.id, huntParticipations.huntId))
    .where(
      and(
        eq(huntParticipations.userId, userId),
        search ? ilike(hunts.name, `%${search}%`) : undefined,
        status === "started"
          ? lt(hunts.startDate, now)
          : status === "upcoming"
            ? gte(hunts.startDate, now)
            : undefined
      )
    )
}

export const selectParticipantByHuntIdAndUserId = async (
  huntId: string,
  userId: string
) => {
  return db.query.huntParticipations.findFirst({
    where: (huntParticipations, { eq, and }) =>
      and(
        eq(huntParticipations.userId, userId),
        eq(huntParticipations.huntId, huntId)
      ),
  })
}
