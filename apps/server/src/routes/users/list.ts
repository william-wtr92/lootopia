import { zValidator } from "@hono/zod-validator"
import {
  defaultLimit,
  defaultPage,
  SC,
  userSearchQuerySchema,
} from "@lootopia/common"
import {
  selectUserByEmail,
  selectUsers,
  selectUsersCount,
  userNotFound,
} from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const userListRoute = app.get(
  "/search",
  zValidator("query", userSearchQuerySchema),
  async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const { limit: limitString, page: offsetString, search } = c.req.query()

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const limit = parseInt(limitString, 10) || defaultLimit
    const page = parseInt(offsetString, 10) || defaultPage

    const usersRetrieved = await selectUsers(limit, page, search)

    const [{ count }] = await selectUsersCount(search)

    const lastPage = Math.ceil(count / limit) - 1

    return c.json({ result: usersRetrieved, lastPage }, SC.success.OK)
  }
)
