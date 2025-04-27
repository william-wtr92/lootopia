import { chestOpenings, hunts, payments, users } from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import {
  startOfCurrentMonth,
  startOfNextMonth,
  startOfPreviousMonth,
} from "@server/utils/helpers/times"
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

export const selectPreviousMonthRevenues = async () => {
  return await db
    .select({
      sum: sum(payments.amount),
    })
    .from(payments)
    .where(
      and(
        lt(payments.createdAt, startOfCurrentMonth),
        gte(payments.createdAt, startOfPreviousMonth)
      )
    )
}

export const selectCurrentMonthRevenues = async () => {
  return await db
    .select({
      sum: sum(payments.amount),
    })
    .from(payments)
    .where(gte(payments.createdAt, startOfCurrentMonth))
}
