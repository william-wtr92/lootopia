import { crownPackages, payments, users } from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

export const selectCrownsPackages = async () => {
  return db.query.crownPackages.findMany()
}

export const selectCrownPackageById = async (id: string) => {
  return db.query.crownPackages.findFirst({
    where: (crownPackages, { eq }) => eq(crownPackages.id, id),
  })
}

export const selectPaymentsByUserId = async (
  userId: string,
  limit: number,
  page: number,
  search: string
) => {
  const user = alias(users, "reporter")
  const crownPackage = alias(crownPackages, "package")

  const searchConditions = search
    ? or(
        ilike(crownPackage.name, `%${search}%`),
        ilike(sql`CAST(${payments.id} AS text)`, `%${search}%`),
        ilike(sql`CAST(${payments.amount} AS text)`, `%${search}%`)
      )
    : undefined

  return db
    .select({
      payment: payments,
      crownPackage,
    })
    .from(payments)
    .leftJoin(user, eq(payments.userId, user.id))
    .leftJoin(crownPackage, eq(payments.crownPackageId, crownPackage.id))
    .where(
      and(
        eq(payments.userId, userId),
        ...(searchConditions ? [searchConditions] : [])
      )
    )
    .orderBy(desc(payments.createdAt))
    .limit(limit)
    .offset(page * limit)
}

export const selectPaymentsByUserIdCount = async (
  userId: string,
  search: string
) => {
  const user = alias(users, "reporter")
  const crownPackage = alias(crownPackages, "package")

  const searchConditions = search
    ? or(
        ilike(crownPackage.name, `%${search}%`),
        ilike(sql`CAST(${payments.id} AS text)`, `%${search}%`),
        ilike(sql`CAST(${payments.amount} AS text)`, `%${search}%`)
      )
    : undefined

  return db
    .select({
      count: count(),
    })
    .from(payments)
    .leftJoin(user, eq(payments.userId, user.id))
    .leftJoin(crownPackage, eq(payments.crownPackageId, crownPackage.id))
    .where(
      and(
        eq(payments.userId, userId),
        ...(searchConditions ? [searchConditions] : [])
      )
    )
}
