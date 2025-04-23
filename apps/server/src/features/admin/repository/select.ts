import { users } from "@lootopia/drizzle"
import { db } from "@server/db/client"
import { count, eq, ilike } from "drizzle-orm"

export const selectAdminUsers = async (limit: number, page: number, search: string) => {
  return db.query.users.findMany({
    where: (users, { ilike }) =>
      search ? ilike(users.nickname, `%${search}%`) : undefined,
    limit,
    offset: (page - 1) * limit,
  })
}

export const selectAdminUsersCount = async (search: string) => {
  return db
    .select({ count: count() })
    .from(users)
    .where(ilike(users.nickname, `%${search}%`))
}
