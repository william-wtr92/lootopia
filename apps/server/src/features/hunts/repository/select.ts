import { hunts } from "@lootopia/drizzle"
import { db } from "@server/db/client"
import { count, ilike } from "drizzle-orm"

export const selectHunts = async (
  limit: number,
  page: number,
  name: string | undefined,
  city: string | undefined
) => {
  const query = db
    .select()
    .from(hunts)
    .limit(limit)
    .offset(page * limit)
  // .fullJoin(users, eq(hunts.organizerId, users.id))

  if (name) {
    query.where(ilike(hunts.name, `%${name}%`))
  }

  if (city) {
    query.where(ilike(hunts.city, `%${city}%`))
  }

  return query
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
