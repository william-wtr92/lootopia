import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import {
  userSearchParamsSchema,
  SC,
  defaultLimit,
  defaultPage,
} from "@lootopia/common"
import { selectAdminUsers, selectAdminUsersCount } from "@server/features/admin/repository/select"
import { adminOnly } from "@server/middlewares/adminOnly"

const app = new Hono()

export const adminListRoute = app.get(
  "/users",
  zValidator("query", userSearchParamsSchema),
  adminOnly,
  async (c) => {
    const { limit = defaultLimit, page = defaultPage, search = "" } = c.req.valid("query")

    const users = await selectAdminUsers(Number(limit), Number(page), search)
    const [{ count }] = await selectAdminUsersCount(search)

    return c.json(
      {
        result: users,
        total: Number(count),
      },
      SC.success.OK
    )
  }
)