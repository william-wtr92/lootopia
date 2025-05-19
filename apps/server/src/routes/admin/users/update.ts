import { zValidator } from "@hono/zod-validator"
import { SC, usersUpdateActiveSchema } from "@lootopia/common"
import {
  selectUserByEmail,
  updateActiveSuccess,
  updateUserActive,
  userNotFound,
} from "@server/features/users"
import { Hono } from "hono"

const app = new Hono()

export const adminUsersUpdateRoute = app.post(
  "/users/update",
  zValidator("json", usersUpdateActiveSchema),
  async (c) => {
    const { email } = c.req.valid("json")

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    await updateUserActive(email, !user.active)

    return c.json(updateActiveSuccess, SC.success.OK)
  }
)
