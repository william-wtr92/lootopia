import { crowns, users } from "@lootopia/drizzle"
import type { User } from "@server/features/users/types"
import { db } from "@server/utils/clients/postgres"
import { eq, ilike, count } from "drizzle-orm"

export const selectUserByEmail = async (email: string) => {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })
}

export const selectUserByNickname = async (nickname: string) => {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.nickname, nickname),
  })
}

export const selectUserByPhone = async (phone: string) => {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.phone, phone),
  })
}

export const selectUserWithCrowns = async (email: string) => {
  const [row] = await db
    .select({
      user: users,
      crowns: crowns.amount,
    })
    .from(users)
    .where(eq(users.email, email))
    .leftJoin(crowns, eq(users.id, crowns.userId))

  return {
    ...row.user,
    crowns: row.crowns ?? null,
  } satisfies User
}

export const selectUserById = async (id: string) => {
  return db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  })
}

export const selectUsers = async (
  limit: number,
  page: number,
  search: string
) => {
  return db.query.users.findMany({
    where: (users, { ilike }) => {
      if (search) {
        return ilike(users.nickname, `%${search}%`)
      }

      return undefined
    },
    limit,
    offset: page * limit,
  })
}

export const selectUsersCount = async (search: string) => {
  return db
    .select({ count: count() })
    .from(users)
    .where(ilike(users.nickname, `%${search}%`))
}
