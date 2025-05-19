import { zValidator } from "@hono/zod-validator"
import {
  defaultLimit,
  defaultPage,
  SC,
  usersListQuerySchema,
  type SortingType,
} from "@lootopia/common"
import { selectUsers, selectUsersCount } from "@server/features/users"
import { Hono } from "hono"

const app = new Hono()

export const adminUsersListRoute = app.get(
  "/users/list",
  zValidator("query", usersListQuerySchema),
  async (c) => {
    const {
      limit: limitString,
      page: offsetString,
      search,
      sortingKey,
      sortingType,
    } = c.req.query()

    const limit = parseInt(limitString, 10) || defaultLimit
    const page = parseInt(offsetString, 10) || defaultPage

    const sorting = {
      key: sortingKey,
      type: sortingType,
    } as SortingType

    const users = await selectUsers(limit, page, search, sorting, true)

    const [{ count }] = await selectUsersCount(search ?? "")

    const lastPage = Math.ceil(count / limit)

    return c.json({ result: users, lastPage }, SC.success.OK)
  }
)
