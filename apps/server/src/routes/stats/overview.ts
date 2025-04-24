import {
  selectBeforeCurrentMonthTotalRevenues,
  selectBeforeCurrentMonthTotalUsers,
  selectCurrentMonthTotalChestsOpening,
  selectPreviousMonthTotalChestsOpening,
  selectTotalHunts,
  selectTotalRevenues,
  selectTotalUsers,
} from "@server/features/stats/repository/overview"
import { computeProgressPercentage } from "@server/utils/helpers/getProgressPercentage"
import { Hono } from "hono"

const app = new Hono()

export const overviewRoute = app.get("/overview/top-data", async (c) => {
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
  const [{ sum: totalRevenues }] = await selectTotalRevenues()
  const [{ sum: beforeCurrentMonthTotalRevenues }] =
    await selectBeforeCurrentMonthTotalRevenues()

  const totalRevenuesFloat = Number.parseFloat(totalRevenues ?? "0")
  const beforeCurrentMonthTotalRevenuesFloat = Number.parseFloat(
    beforeCurrentMonthTotalRevenues ?? "0"
  )

  const currentMonthTotalRevenues =
    totalRevenuesFloat - beforeCurrentMonthTotalRevenuesFloat

  const totalRevenuesProgress = computeProgressPercentage(
    totalRevenuesFloat,
    beforeCurrentMonthTotalRevenuesFloat
  )

  return c.json({
    result: {
      usersStats: {
        value: currentTotalUsers,
        percentage: totalUsersProgress,
      },
      huntsStats: {
        value: totalHunts,
        percentage: 0,
      },
      chestsStats: {
        value: currentMonthTotalChestsOpening,
        percentage: chestOpeningsProgress,
      },
      revenuesStats: {
        value: currentMonthTotalRevenues,
        percentage: totalRevenuesProgress,
      },
    },
  })
})
