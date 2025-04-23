import {
  offerFilters,
  offerStatus,
  type ArtifactOffersQuerySchema,
} from "@lootopia/common"
import {
  artifactOffers,
  artifactOfferViews,
  artifacts,
  chests,
  hunts,
  userArtifacts,
  users,
} from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
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
      .where(conditions)
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
      .groupBy(artifactOffers.id, artifacts.id, users.nickname, hunts.city)
      .orderBy(orderBy)
      .limit(limit)
      .offset(page * limit),

    db
      .select({ count: count() })
      .from(artifactOffers)
      .where(conditions)
      .leftJoin(
        userArtifacts,
        eq(artifactOffers.userArtifactId, userArtifacts.id)
      )
      .leftJoin(artifacts, eq(userArtifacts.artifactId, artifacts.id)),
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
