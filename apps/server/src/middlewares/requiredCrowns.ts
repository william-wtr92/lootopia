import { SC } from "@lootopia/common"
import { notEnoughCrowns, selectCrownsByUserId } from "@server/features/crowns"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { createMiddleware } from "hono/factory"

export const requiredCrowns = (amount: number) => {
  return createMiddleware(async (c, next) => {
    const email = c.get(contextKeys.loggedUserEmail)

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const amountOfCrowns = await selectCrownsByUserId(user.id)

    if (!amountOfCrowns || amountOfCrowns.amount < amount) {
      return c.json(notEnoughCrowns, SC.errors.FORBIDDEN)
    }

    await next()
  })
}
