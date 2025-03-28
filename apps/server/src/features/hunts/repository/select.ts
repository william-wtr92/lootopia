import type { ChestSchema } from "@lootopia/common"
import { chests, hunts, users } from "@lootopia/drizzle"
import { db } from "@server/db/client"
import { count, eq, ilike, sql } from "drizzle-orm"

export const selectHunts = async (
  limit: number,
  page: number,
  name: string | undefined,
  city: string | undefined
) => {
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

  if (name) {
    query.where(ilike(hunts.name, `%${name}%`))
  }

  if (city) {
    query.where(ilike(hunts.city, `%${city}%`))
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
  }, [] as any[])

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
