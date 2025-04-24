import { chestOpenings, hunts, payments, users } from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { and, count, gte, lt, sql, sum } from "drizzle-orm"

export const selectTotalUsers = async () => {
  const totalUsers = await db
    .select({
      count: count(),
    })
    .from(users)

  return totalUsers
}

export const selectBeforeCurrentMonthTotalUsers = async () => {
  const now = new Date()
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const currentMonthTotalUsers = await db
    .select({ count: count() })
    .from(users)
    .where(lt(users.createdAt, startOfCurrentMonth))

  return currentMonthTotalUsers
}

export const selectTotalHunts = async () => {
  return await db
    .select({
      count: count(),
    })
    .from(hunts)
    .where(gte(hunts.startDate, sql`now()`))
}

export const selectPreviousMonthTotalChestsOpening = async () => {
  const now = new Date()
  const startOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  )
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  return await db
    .select({
      count: count(),
    })
    .from(chestOpenings)
    .where(
      and(
        gte(chestOpenings.obtainedAt, startOfPreviousMonth),
        lt(chestOpenings.obtainedAt, startOfCurrentMonth)
      )
    )
}

export const selectCurrentMonthTotalChestsOpening = async () => {
  const now = new Date()
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  return await db
    .select({
      count: count(),
    })
    .from(chestOpenings)
    .where(
      and(
        gte(chestOpenings.obtainedAt, startOfCurrentMonth),
        lt(chestOpenings.obtainedAt, startOfNextMonth)
      )
    )
}

export const selectTotalRevenues = async () => {
  return await db
    .select({
      sum: sum(payments.amount),
    })
    .from(payments)
}

export const selectBeforeCurrentMonthTotalRevenues = async () => {
  const now = new Date()
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  return await db
    .select({
      sum: sum(payments.amount),
    })
    .from(payments)
    .where(lt(payments.createdAt, startOfCurrentMonth))
}
