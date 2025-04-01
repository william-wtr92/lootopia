import { crownCosts, SC, transactionTypes } from "@lootopia/common"
import { updateHuntCrownsTransaction } from "@server/features/crowns"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { requiredCrowns } from "@server/middlewares/requiredCrowns"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const partipateHuntRoute = app.post(
  "/participate/:huntId",
  requiredCrowns(crownCosts.huntParticipation),
  async (c) => {
    const huntId = c.req.param("huntId")
    const email = c.get(contextKeys.loggedUserEmail)

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    await updateHuntCrownsTransaction(
      transactionTypes.huntParticipation,
      huntId,
      user.id,
      crownCosts.huntParticipation
    )

    return c.json({ message: "Participation registered" })
  }
)
