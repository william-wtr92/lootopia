import {
  crownPackages,
  huntParticipations,
  payments,
  users,
} from "@lootopia/drizzle"
import { db } from "@server/utils/clients/postgres"
import { and, count, gte, lt, sum } from "drizzle-orm"

export const selectLastXMonthsTotalRevenues = async (monthsAgo: number) => {
  const totalRevenuesByMonth = []

  for (let i = monthsAgo - 1; i >= 0; i--) {
    const date = new Date()
    const startDate = new Date(date.getFullYear(), date.getMonth() - i, 2)
    const endDate = new Date(date.getFullYear(), date.getMonth() - i + 1)

    const revenuesOfMonth = await db
      .select({
        sum: sum(payments.amount),
      })
      .from(payments)
      .where(
        and(gte(payments.createdAt, startDate), lt(payments.createdAt, endDate))
      )

    totalRevenuesByMonth.push({
      month: startDate,
      amount: revenuesOfMonth[0].sum
        ? Number.parseFloat(revenuesOfMonth[0].sum)
        : 0,
    })
  }

  return totalRevenuesByMonth
}

export const selectLastXMonthsPopularPackages = async (monthsAgo: number) => {
  const now = new Date()
  const startDate = new Date(
    now.getFullYear(),
    now.getMonth() - monthsAgo + 1,
    1
  )

  const packagesData = db
    .select({
      id: crownPackages.id,
      name: crownPackages.name,
    })
    .from(crownPackages)

  const popularPackagesData = db
    .select({
      packageId: payments.crownPackageId,
      count: count(),
    })
    .from(payments)
    .where(gte(payments.createdAt, startDate))
    .groupBy(payments.crownPackageId)

  const [packages, popularPackages] = await Promise.all([
    packagesData,
    popularPackagesData,
  ])

  const completePopularPackages = popularPackages.map((item) => {
    const packageName = packages.find((pkg) => pkg.id === item.packageId)?.name
    const totalPackagesSold = popularPackages.reduce(
      (acc, curr) => acc + curr.count,
      0
    )

    const rawPercentage = (100 * item.count) / totalPackagesSold
    const percentage = Math.round(Number.parseFloat(rawPercentage.toFixed(2)))

    return {
      name: packageName,
      amount: item.count,
      percentage,
    }
  })

  return completePopularPackages
}

export const selectLastXMonthsTotalUsers = async (monthsAgo: number) => {
  const usersCountPerMonth = []

  for (let i = monthsAgo - 1; i >= 0; i--) {
    const date = new Date()
    const startDate = new Date(date.getFullYear(), date.getMonth() - i, 2)
    const endDate = new Date(date.getFullYear(), date.getMonth() - i + 1)

    const usersCountOfMonth = await db
      .select({
        count: count(),
      })
      .from(users)
      .where(lt(users.createdAt, endDate))

    usersCountPerMonth.push({
      month: startDate,
      count: usersCountOfMonth[0].count,
    })
  }

  return usersCountPerMonth
}

export const selectLastXMonthsHuntParticipations = async (
  monthsAgo: number
) => {
  const huntParticipationsByMonth = []

  for (let i = monthsAgo - 1; i >= 0; i--) {
    const date = new Date()
    const startDate = new Date(date.getFullYear(), date.getMonth() - i, 2)
    const endDate = new Date(date.getFullYear(), date.getMonth() - i + 1)

    const huntParticipationsOfMonth = await db
      .select({
        count: count(),
      })
      .from(huntParticipations)
      .where(
        and(
          gte(huntParticipations.joinedAt, startDate),
          lt(huntParticipations.joinedAt, endDate)
        )
      )

    huntParticipationsByMonth.push({
      month: startDate,
      count: huntParticipationsOfMonth[0].count,
    })
  }

  return huntParticipationsByMonth
}
