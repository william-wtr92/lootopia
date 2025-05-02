import { defaultLimit, defaultPage, SC } from "@common/index"
import { selectUsers, selectUsersCount } from "@server/features/users"
import { Hono } from "hono"

const app = new Hono()

export const adminUsersListRoute = app.get("/users/list", async (c) => {
  const { limit: limitString, page: offsetString, search } = c.req.query()

  const limit = parseInt(limitString, 10) || defaultLimit
  const page = parseInt(offsetString, 10) || defaultPage

  const usersRetrieved = await selectUsers(limit, page, search, true)

  const [{ count }] = await selectUsersCount(search ?? "")

  const lastPage = Math.ceil(count / limit)

  return c.json({ result: usersRetrieved, lastPage }, SC.success.OK)
})
