import {
  offerFilters,
  offerStatus,
  transactionTypes,
  type ArtifactOffersQuerySchema,
} from "@lootopia/common"
import {
  artifactOfferFavorites,
  artifactOffers,
  artifactOfferViews,
  artifactOwnershipHistory,
  artifacts,
  chests,
  hunts,
  transactions,
  userArtifacts,
  users,
} from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { delta, variation } from "@server/utils/helpers/math"
import {
  getStartOfLastWeek,
  getStartOfWeek,
  startOfLastMonth,
  startOfMonth,
} from "@server/utils/helpers/times"
import {
  and,
  desc,
  eq,
  exists,
  ilike,
  not,
  count,
  gte,
  sql,
  asc,
  lte,
  type SQL,
  or,
  sum,
  isNotNull,
  lt,
  ne,
} from "drizzle-orm"

export const selectUserArtifactAvailableForOffer = async (
  userId: string,
  limit: number,
  page: number,
  search?: string
) => {
  const offerExistsSubquery = (uaId: typeof userArtifacts.id) =>
    db
      .select({ id: artifactOffers.id })
      .from(artifactOffers)
      .where(
        and(
          eq(artifactOffers.userArtifactId, uaId),
          eq(artifactOffers.status, offerStatus.active)
        )
      )
      .limit(1)

  const [artifactsAvailable, countResult] = await Promise.all([
    db
      .select({
        artifact: artifacts,
        userArtifactId: userArtifacts.id,
        huntName: hunts.name,
        obtainedAt: userArtifacts.obtainedAt,
      })
      .from(userArtifacts)
      .where(
        and(
          eq(userArtifacts.userId, userId),
          not(exists(offerExistsSubquery(userArtifacts.id))),
          search ? ilike(artifacts.name, `%${search}%`) : undefined
        )
      )
      .leftJoin(artifacts, eq(userArtifacts.artifactId, artifacts.id))
      .leftJoin(chests, eq(userArtifacts.obtainedFromChestId, chests.id))
      .leftJoin(hunts, eq(chests.huntId, hunts.id))
      .limit(limit)
      .offset(page * limit)
      .orderBy(desc(userArtifacts.obtainedAt)),

    db
      .select({ count: count() })
      .from(userArtifacts)
      .where(
        and(
          eq(userArtifacts.userId, userId),
          not(exists(offerExistsSubquery(userArtifacts.id))),
          search ? ilike(artifacts.name, `%${search}%`) : undefined
        )
      )
      .leftJoin(artifacts, eq(userArtifacts.artifactId, artifacts.id)),
  ])

  return [artifactsAvailable, countResult[0].count] as const
}

export const selectArtifactOffers = async (
  limit: number,
  page: number,
  userId: string,
  {
    search,
    filters,
    minPrice,
    maxPrice,
    sortBy = offerFilters.latest,
  }: Omit<ArtifactOffersQuerySchema, "page">
) => {
  const conditions = and(
    eq(artifactOffers.status, offerStatus.active),
    search ? ilike(artifacts.name, `%${search}%`) : undefined,
    filters ? eq(artifacts.rarity, filters) : undefined,
    minPrice
      ? gte(sql`${artifactOffers.price}::int`, Number(minPrice))
      : undefined,
    maxPrice
      ? lte(sql`${artifactOffers.price}::int`, Number(maxPrice))
      : undefined
  )

  let orderBy: SQL

  switch (sortBy) {
    case offerFilters.priceAsc:
      orderBy = asc(sql`${artifactOffers.price}::int`)

      break

    case offerFilters.priceDesc:
      orderBy = desc(sql`${artifactOffers.price}::int`)

      break

    case offerFilters.rarity:
      orderBy = desc(artifacts.rarity)

      break

    case offerFilters.latest:
      orderBy = desc(artifactOffers.createdAt)

      break

    default:
      orderBy = desc(artifactOffers.createdAt)
  }

  const [offers, countResult] = await Promise.all([
    db
      .select({
        offer: artifactOffers,
        artifact: artifacts,
        sellerNickname: users.nickname,
        huntCity: hunts.city,
        views: sql<number>`count(${artifactOfferViews.id})`.as("views"),
      })
      .from(artifactOffers)
      .where(
        and(
          conditions,
          sortBy === offerFilters.favorites
            ? eq(artifactOfferFavorites.userId, userId)
            : undefined
        )
      )
      .leftJoin(
        artifactOfferViews,
        eq(artifactOfferViews.offerId, artifactOffers.id)
      )
      .leftJoin(
        userArtifacts,
        eq(artifactOffers.userArtifactId, userArtifacts.id)
      )
      .leftJoin(artifacts, eq(userArtifacts.artifactId, artifacts.id))
      .leftJoin(chests, eq(userArtifacts.obtainedFromChestId, chests.id))
      .leftJoin(hunts, eq(chests.huntId, hunts.id))
      .leftJoin(users, eq(artifactOffers.sellerId, users.id))
      .leftJoin(
        artifactOfferFavorites,
        eq(artifactOfferFavorites.offerId, artifactOffers.id)
      )
      .groupBy(
        artifactOffers.id,
        artifacts.id,
        users.nickname,
        hunts.city,
        ...(sortBy === offerFilters.favorites
          ? [artifactOfferFavorites.favoritedAt]
          : [])
      )
      .orderBy(
        sortBy === offerFilters.favorites
          ? desc(artifactOfferFavorites.favoritedAt)
          : orderBy
      )
      .limit(limit)
      .offset(page * limit),

    db
      .select({ count: count() })
      .from(artifactOffers)
      .where(
        and(
          conditions,
          sortBy === offerFilters.favorites
            ? eq(artifactOfferFavorites.userId, userId)
            : undefined
        )
      )
      .leftJoin(
        userArtifacts,
        eq(artifactOffers.userArtifactId, userArtifacts.id)
      )
      .leftJoin(artifacts, eq(userArtifacts.artifactId, artifacts.id))
      .leftJoin(
        artifactOfferFavorites,
        eq(artifactOfferFavorites.offerId, artifactOffers.id)
      ),
  ])

  return [offers, countResult[0].count] as const
}

export const selectUserArtifactOfferByUserArtifactId = async (
  userId: string,
  userArtifactId: string
) => {
  return db.query.artifactOffers.findFirst({
    where: (artifactOffers, { eq }) =>
      and(
        eq(artifactOffers.sellerId, userId),
        eq(artifactOffers.userArtifactId, userArtifactId),
        eq(artifactOffers.status, offerStatus.active)
      ),
  })
}

export const selectOfferById = async (offerId: string) => {
  return db.query.artifactOffers.findFirst({
    where: (artifactOffers, { eq }) => eq(artifactOffers.id, offerId),
  })
}

export const selectFavoriteByUserIdAndOfferId = async (
  userId: string,
  offerId: string
) => {
  return db.query.artifactOfferFavorites.findFirst({
    where: (artifactOfferFavorites, { eq }) =>
      and(
        eq(artifactOfferFavorites.userId, userId),
        eq(artifactOfferFavorites.offerId, offerId)
      ),
  })
}

export const selectOffersExpiredOrSolded = async () => {
  return db
    .select({ id: artifactOffers.id })
    .from(artifactOffers)
    .where(
      and(
        or(
          eq(artifactOffers.status, offerStatus.sold),
          eq(artifactOffers.status, offerStatus.expired),
          eq(artifactOffers.status, offerStatus.cancelled)
        ),
        lte(artifactOffers.expiresAt, sql`NOW()`)
      )
    )
}

export const selectUserOfferStats = async (userId: string) => {
  const [
    activeOffersCountResult,
    transactionsCurrent,
    profitCurrent,
    artifactsCurrent,
    transactionsPrevious,
    profitPrevious,
    artifactsPrevious,
  ] = await Promise.all([
    db
      .select({ count: count() })
      .from(artifactOffers)
      .where(
        and(
          eq(artifactOffers.sellerId, userId),
          eq(artifactOffers.status, offerStatus.active)
        )
      ),

    db
      .select({ count: count() })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, transactionTypes.offerPayment),
          gte(transactions.createdAt, startOfMonth)
        )
      ),

    db
      .select({ total: sum(transactions.amount) })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, transactionTypes.offerPayment),
          gte(transactions.createdAt, startOfMonth)
        )
      ),

    db
      .selectDistinct({ id: artifactOwnershipHistory.userArtifactId })
      .from(artifactOwnershipHistory)
      .where(
        and(
          eq(artifactOwnershipHistory.previousOwnerId, userId),
          isNotNull(artifactOwnershipHistory.offerId),
          not(eq(artifactOwnershipHistory.newOwnerId, userId)),
          gte(artifactOwnershipHistory.createdAt, startOfMonth)
        )
      ),

    db
      .select({ count: count() })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, transactionTypes.offerPayment),
          gte(transactions.createdAt, startOfLastMonth),
          lt(transactions.createdAt, startOfMonth)
        )
      ),

    db
      .select({ total: sum(transactions.amount) })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          eq(transactions.type, transactionTypes.offerPayment),
          gte(transactions.createdAt, startOfLastMonth),
          lt(transactions.createdAt, startOfMonth)
        )
      ),

    db
      .selectDistinct({ id: artifactOwnershipHistory.userArtifactId })
      .from(artifactOwnershipHistory)
      .where(
        and(
          eq(artifactOwnershipHistory.previousOwnerId, userId),
          isNotNull(artifactOwnershipHistory.offerId),
          not(eq(artifactOwnershipHistory.newOwnerId, userId)),
          gte(artifactOwnershipHistory.createdAt, startOfLastMonth),
          lt(artifactOwnershipHistory.createdAt, startOfMonth)
        )
      ),
  ])

  const current = {
    activeOffers: Number(activeOffersCountResult[0]?.count ?? 0),
    transactions: Number(transactionsCurrent[0]?.count ?? 0),
    profit: Number(profitCurrent[0]?.total ?? 0),
    artifacts: artifactsCurrent.length,
  }

  const previous = {
    transactions: Number(transactionsPrevious[0]?.count ?? 0),
    profit: Number(profitPrevious[0]?.total ?? 0),
    artifacts: artifactsPrevious.length,
  }

  return {
    transactions: {
      current: current.transactions,
      variation: variation(current.transactions, previous.transactions),
      delta: delta(current.transactions, previous.transactions),
    },
    profit: {
      current: current.profit,
      variation: variation(current.profit, previous.profit),
      delta: delta(current.profit, previous.profit),
    },
    artifacts: {
      current: current.artifacts,
      variation: variation(current.artifacts, previous.artifacts),
      delta: delta(current.artifacts, previous.artifacts),
    },
    activeOffers: current.activeOffers,
  }
}

export const selectOfferRarityStats = async () => {
  const [rarityStats, totalPreviousResult] = await Promise.all([
    db
      .select({
        rarity: artifacts.rarity,
        sales: count(),
      })
      .from(artifactOwnershipHistory)
      .innerJoin(
        userArtifacts,
        eq(artifactOwnershipHistory.userArtifactId, userArtifacts.id)
      )
      .innerJoin(artifacts, eq(userArtifacts.artifactId, artifacts.id))
      .where(
        and(
          isNotNull(artifactOwnershipHistory.offerId),
          ne(
            artifactOwnershipHistory.newOwnerId,
            artifactOwnershipHistory.previousOwnerId
          ),
          gte(artifactOwnershipHistory.createdAt, startOfMonth)
        )
      )
      .groupBy(artifacts.rarity),

    db
      .select({ sales: count() })
      .from(artifactOwnershipHistory)
      .where(
        and(
          isNotNull(artifactOwnershipHistory.offerId),
          ne(
            artifactOwnershipHistory.newOwnerId,
            artifactOwnershipHistory.previousOwnerId
          ),
          gte(artifactOwnershipHistory.createdAt, startOfLastMonth),
          lt(artifactOwnershipHistory.createdAt, startOfMonth)
        )
      ),
  ])

  const totalCurrent = rarityStats.reduce((acc, r) => acc + Number(r.sales), 0)
  const totalPrevious = Number(totalPreviousResult[0]?.sales ?? 0)
  const salesVariation = variation(totalCurrent, totalPrevious)

  return {
    rarityStats: rarityStats.map((r) => ({
      rarity: r.rarity,
      sales: Number(r.sales),
    })),
    total: totalCurrent,
    variation: salesVariation,
  }
}

export const selectWeeklyOfferStats = async () => {
  const [weeklyStats, totalWeeklyResult] = await Promise.all([
    db
      .select({
        createdAt: artifactOwnershipHistory.createdAt,
        amount: transactions.amount,
      })
      .from(artifactOwnershipHistory)
      .innerJoin(
        transactions,
        eq(artifactOwnershipHistory.offerId, transactions.artifactOfferId)
      )
      .where(
        and(
          isNotNull(artifactOwnershipHistory.offerId),
          ne(
            artifactOwnershipHistory.newOwnerId,
            artifactOwnershipHistory.previousOwnerId
          ),
          gte(artifactOwnershipHistory.createdAt, getStartOfWeek())
        )
      ),

    db
      .select({
        amount: transactions.amount,
      })
      .from(artifactOwnershipHistory)
      .innerJoin(
        transactions,
        eq(artifactOwnershipHistory.offerId, transactions.artifactOfferId)
      )
      .where(
        and(
          isNotNull(artifactOwnershipHistory.offerId),
          ne(
            artifactOwnershipHistory.newOwnerId,
            artifactOwnershipHistory.previousOwnerId
          ),
          gte(artifactOwnershipHistory.createdAt, getStartOfLastWeek()),
          lt(artifactOwnershipHistory.createdAt, getStartOfWeek())
        )
      ),
  ])

  const daysMap: Record<string, { sales: number; crowns: number }> = {}

  for (const row of weeklyStats) {
    if (row.amount <= 0) {
      continue
    }

    const day = row.createdAt.toLocaleDateString("en-US", { weekday: "short" })

    if (!daysMap[day]) {
      daysMap[day] = { sales: 0, crowns: 0 }
    }

    daysMap[day].sales++
    daysMap[day].crowns += row.amount
  }

  const totalCrownsCurrent = weeklyStats
    .filter((r) => r.amount > 0)
    .reduce((sum, r) => sum + r.amount, 0)

  const totalCrownsLastWeek = totalWeeklyResult
    .filter((r) => r.amount > 0)
    .reduce((sum, r) => sum + r.amount, 0)

  const crownsVariation = variation(totalCrownsCurrent, totalCrownsLastWeek)

  const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return {
    weekly: orderedDays.map((day) => ({
      day,
      sales: daysMap[day]?.sales ?? 0,
      crowns: daysMap[day]?.crowns ?? 0,
    })),
    variation: crownsVariation,
    total: totalCrownsCurrent,
  }
}
