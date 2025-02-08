import { SC } from "@lootopia/common"
import { sanitizeUser, userNotFound } from "@server/features/users"
import { selectUserByEmail } from "@server/features/users/repository/select"
import { auth } from "@server/middlewares/auth"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono<{ Variables: { loggedUserEmail: string } }>()

export const usersRoutes = app.get("/me", auth, async (c) => {
  const email = c.get(contextKeys.loggedUserEmail)

  const user = await selectUserByEmail(email)

  if (!user) {
    return c.json(userNotFound, SC.errors.NOT_FOUND)
  }

  return c.json({ result: sanitizeUser(user) }, SC.success.OK)
})

export default app
