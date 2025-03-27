import { crownCosts } from "@common/crowns"
import { requiredCrowns } from "@server/middlewares/requiredCrowns"
import { Hono } from "hono"

const app = new Hono()

export const partipateHuntRoute = app.post(
  "/participate",
  requiredCrowns(crownCosts.huntParticipation),
  async (c) => {
    return c.json({ message: "Participation registered" })
  }
)
