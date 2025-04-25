import { SC } from "@lootopia/common"
import {
  selectOfferRarityStats,
  selectUserOfferStats,
  selectWeeklyOfferStats,
} from "@server/features/town-hall"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const offerStatsRoute = app
  .get("/offers/stats/mine", async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const { transactions, profit, artifacts, activeOffers } =
      await selectUserOfferStats(user.id)

    return c.json(
      {
        result: {
          transactions,
          profit,
          artifacts,
          activeOffers,
        },
      },
      SC.success.OK
    )
  })
  .get("/offers/stats/rarity", async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const offerRarityStats = await selectOfferRarityStats()

    return c.json(
      {
        result: offerRarityStats,
      },
      SC.success.OK
    )
  })
  .get("/offers/stats/weekly", async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const weeklyOfferStats = await selectWeeklyOfferStats()

    return c.json(
      {
        result: weeklyOfferStats,
      },
      SC.success.OK
    )
  })
