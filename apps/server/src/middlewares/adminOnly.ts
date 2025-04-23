import { SC } from "@lootopia/common"
import { type MiddlewareHandler } from "hono"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { selectUserByEmail } from "@server/features/users"
import { userNotFound } from "@server/features/users"

export const adminOnly: MiddlewareHandler = async (c, next) => {
  const email = c.get(contextKeys.loggedUserEmail)

  if (!email) {
    return c.json(userNotFound, SC.errors.UNAUTHORIZED)
  }

  const user = await selectUserByEmail(email)

  if (!user || user.role !== "admin") {
    return c.json({ result: "Unauthorized", key: "unauthorized" }, SC.errors.UNAUTHORIZED)
  }

  await next()
}
