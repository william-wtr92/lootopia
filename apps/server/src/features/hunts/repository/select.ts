import type { ChestSchema, PositionSchema } from "@lootopia/common"
import { chests, hunts, users } from "@lootopia/drizzle"
import { db } from "@server/db/client"
import { and, count, eq, gt, ilike, or, sql } from "drizzle-orm"

import type { HuntWithChests } from "../types"

export const selectHunts = async ({
  limit,
  page,
  filters = {},
}: {
  limit: number
  page: number
  filters?: {
    name?: string
    city?: string
    search?: string
    organizerId?: string
  }
}) => {
  const conditions = []

  if (filters.search && filters.search.trim() !== "") {
    conditions.push(
      or(
        ilike(hunts.name, `%${filters.search}%`),
        ilike(hunts.city, `%${filters.search}%`)
      )
    )
  }

  if (filters.name) {
    conditions.push(ilike(hunts.name, `%${filters.name}%`))
  }

  if (filters.city) {
    conditions.push(ilike(hunts.city, `%${filters.city}%`))
  }

  if (filters.organizerId) {
    conditions.push(eq(hunts.organizerId, filters.organizerId))
  }

  const query = db
    .select({
      hunt: hunts,
      chests: sql`json_agg(${chests})`.as("chests"),
      organizer: {
        id: users.id,
        nickname: users.nickname,
        email: users.email,
        phone: users.phone,
        birthdate: users.birthdate,
        avatar: users.avatar,
        role: users.role,
      },
    })
    .from(hunts)
    .leftJoin(chests, eq(hunts.id, chests.huntId))
    .leftJoin(users, eq(hunts.organizerId, users.id))
    .groupBy(hunts.id, users.id)
    .limit(limit)
    .offset(page * limit)

  if (conditions.length > 0) {
    query.where(and(...conditions))
  }

  const result = await query

  // Using the json_agg function in the query returns the chest's position in Point coordinates format
  // So we need to map it to XY coordinates
  const processedResult = result.reduce((acc, { hunt, chests, organizer }) => {
    acc.push({
      ...hunt,
      chests: (chests as ChestSchema[]).map((chest: any) => ({
        ...chest,
        position: {
          x: chest.position.coordinates[0],
          y: chest.position.coordinates[1],
        },
      })),
      organizer,
    })

    return acc
  }, [] as HuntWithChests[])

  return processedResult
}

export const selectHuntsCount = async (
  name: string | undefined,
  city: string | undefined
) => {
  const query = db.select({ count: count() }).from(hunts)

  if (name) {
    query.where(ilike(hunts.name, `%${name}%`))
  }

  if (city) {
    query.where(ilike(hunts.city, `%${city}%`))
  }

  return query
}

export const selectHuntById = async (huntId: string) => {
  return db.query.hunts.findFirst({
    where: (hunts, { eq }) => eq(hunts.id, huntId),
  })
}

export const selectOrganizerHuntsCount = async (organizerId: string) => {
  return db
    .select({ count: count() })
    .from(hunts)
    .where(eq(hunts.organizerId, organizerId))
}

export const selectChestInAreaByHuntId = async (
  huntId: string,
  position: PositionSchema
) => {
  const tenMetersAround = 10

  return db
    .select()
    .from(chests)
    .where(
      and(
        eq(chests.huntId, huntId),
        gt(chests.maxUsers, 0),
        sql`ST_DWithin(
        ${chests.position}::geography, 
        ST_SetSRID(ST_MakePoint(${position.lng}, ${position.lat}), 4326)::geography, 
        ${tenMetersAround} 
      )`
      )
    )
}

export const selectClosestChestByHuntId = async (
  huntId: string,
  position: PositionSchema
) => {
  return db
    .select({
      chest: chests,
      distance: sql`ST_Distance(
      ${chests.position}::geography,
      ST_SetSRID(ST_MakePoint(${position.lng}, ${position.lat}), 4326)::geography
    )`.as("distance"),
    })
    .from(chests)
    .where(and(eq(chests.huntId, huntId), gt(chests.maxUsers, 0)))
    .orderBy(sql`distance ASC`)
    .limit(1)
}
