import { reports, users } from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { and, count, desc, eq, ilike, or } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

export const selectReportsByUserId = async (
  userId: string,
  limit: number,
  page: number,
  search: string
) => {
  const reporter = alias(users, "reporter")
  const reported = alias(users, "reported")

  const searchConditions = search
    ? or(
        ilike(reported.nickname, `%${search}%`),
        ilike(reporter.nickname, `%${search}%`),
        ilike(reports.description, `%${search}%`)
      )
    : undefined

  return db
    .select({
      report: reports,
      reporterUser: {
        nickname: reporter.nickname,
        avatar: reporter.avatar,
      },
      reportedUser: {
        nickname: reported.nickname,
        avatar: reported.avatar,
      },
    })
    .from(reports)
    .leftJoin(reporter, eq(reports.reporterId, reporter.id))
    .leftJoin(reported, eq(reports.reportedId, reported.id))
    .where(
      and(
        eq(reports.reporterId, userId),
        ...(searchConditions ? [searchConditions] : [])
      )
    )

    .orderBy(desc(reports.createdAt))
    .limit(limit)
    .offset(page * limit)
}

export const selectReportsByUserIdCount = async (
  userId: string,
  search: string
) => {
  const reporter = alias(users, "reporter")
  const reported = alias(users, "reported")

  const searchConditions = search
    ? or(
        ilike(reported.nickname, `%${search}%`),
        ilike(reporter.nickname, `%${search}%`),
        ilike(reports.description, `%${search}%`)
      )
    : undefined

  return db
    .select({ count: count() })
    .from(reports)
    .leftJoin(reporter, eq(reports.reporterId, reporter.id))
    .leftJoin(reported, eq(reports.reportedId, reported.id))
    .where(
      and(
        eq(reports.reporterId, userId),
        ...(searchConditions ? [searchConditions] : [])
      )
    )
}
