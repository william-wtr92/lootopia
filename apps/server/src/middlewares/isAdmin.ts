import { ROLES, SC } from "@lootopia/common"
import {
  notAuthorized,
  selectUserByEmail,
  userNotFound,
} from "@server/features/users"
import { createMiddleware } from "hono/factory"

export const isAdmin = createMiddleware(async (c, next) => {
  const loggedUserEmail = c.get("loggedUserEmail")

  const user = await selectUserByEmail(loggedUserEmail)

  if (!user) {
    return c.json(userNotFound, SC.errors.NOT_FOUND)
  }

  if (user.role !== ROLES.admin) {
    return c.json(notAuthorized, SC.errors.FORBIDDEN)
  }

  await next()
})
