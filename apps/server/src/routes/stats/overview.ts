import {
  selectBeforeCurrentMonthTotalUsers,
  selectCurrentMonthRevenues,
  selectCurrentMonthTotalChestsOpening,
  selectPreviousMonthRevenues,
  selectPreviousMonthTotalChestsOpening,
  selectTotalHunts,
  selectTotalUsers,
} from "@server/features/stats/repository/overview"
import { computeProgressPercentage } from "@server/utils/helpers/math"
import { Hono } from "hono"

import {
  selectLastXMonthsHuntParticipations,
  selectLastXMonthsPopularPackages,
  selectLastXMonthsTotalRevenues,
  selectLastXMonthsTotalUsers,
} from "./mainStats"

const app = new Hono()

export const overviewRoute = app
  .get("/overview/top-data", async (c) => {
    // Total users
    const [{ count: currentTotalUsers }] = await selectTotalUsers()
    const [{ count: beforeCurrentMonthTotalUsers }] =
      await selectBeforeCurrentMonthTotalUsers()

    const totalUsersProgress = computeProgressPercentage(
      currentTotalUsers,
      beforeCurrentMonthTotalUsers
    )

    // Current active hunts
    const [{ count: totalHunts }] = await selectTotalHunts()

    // Chests openings of the current month
    const [{ count: currentMonthTotalChestsOpening }] =
      await selectCurrentMonthTotalChestsOpening()
    const [{ count: previousMonthTotalChestsOpening }] =
      await selectPreviousMonthTotalChestsOpening()

    const chestOpeningsProgress = computeProgressPercentage(
      currentMonthTotalChestsOpening,
      previousMonthTotalChestsOpening
    )

    // Revenues of the current month
    const [{ sum: currentMonthRevenues }] = await selectCurrentMonthRevenues()
    const [{ sum: previousMonthRevenues }] = await selectPreviousMonthRevenues()

    const currentRevenuesFloat = Number.parseFloat(currentMonthRevenues ?? "0")
    const previousMonthRevenuesFloat = Number.parseFloat(
      previousMonthRevenues ?? "0"
    )

    const totalRevenuesProgress = computeProgressPercentage(
      currentRevenuesFloat,
      previousMonthRevenuesFloat
    )

    return c.json({
      result: {
        usersStats: {
          value: currentTotalUsers,
          lastMonthValue: beforeCurrentMonthTotalUsers,
          percentage: totalUsersProgress,
        },
        huntsStats: {
          value: totalHunts,
          lastMonthValue: null,
          percentage: 0,
        },
        chestsStats: {
          value: currentMonthTotalChestsOpening,
          lastMonthValue: previousMonthTotalChestsOpening,
          percentage: chestOpeningsProgress,
        },
        revenuesStats: {
          value: currentRevenuesFloat,
          lastMonthValue: previousMonthRevenuesFloat,
          percentage: totalRevenuesProgress,
        },
      },
    })
  })
  .get("overview/stats", async (c) => {
    const lastSixMonthsTotalRevenues = await selectLastXMonthsTotalRevenues(6)

    const lastSixMonthsPopularPackages =
      await selectLastXMonthsPopularPackages(6)

    const lastSixMonthTotalUsers = await selectLastXMonthsTotalUsers(6)

    const lastSixMonthsHuntParticipations =
      await selectLastXMonthsHuntParticipations(6)

    const totalUsersHuntParticipationsDifference = lastSixMonthTotalUsers.map(
      (row, index) => {
        const huntParticipations = lastSixMonthsHuntParticipations[index]

        return {
          month: row.month,
          totalUsers: row.count,
          huntParticipations: huntParticipations.count ?? 0,
        }
      }
    )

    return c.json({
      result: {
        lastSixMonthsTotalRevenues,
        lastSixMonthsPopularPackages,
        totalUsersHuntParticipationsDifference,
      },
    })
  })
