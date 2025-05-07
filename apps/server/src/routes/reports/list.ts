import { zValidator } from "@hono/zod-validator"
import {
  defaultLimit,
  defaultPage,
  reportListQuerySchema,
  SC,
} from "@lootopia/common"
import {
  selectReportsByUserId,
  selectReportsByUserIdCount,
} from "@server/features/reports"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const reportListRoute = app.get(
  "/",
  zValidator("query", reportListQuerySchema),
  async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const { limit: limitString, page: offsetString, search } = c.req.query()

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const limit = parseInt(limitString, 10) || defaultLimit
    const page = parseInt(offsetString, 10) || defaultPage

    const userReports = await selectReportsByUserId(
      user.id,
      limit,
      page,
      search
    )

    const [{ count }] = await selectReportsByUserIdCount(user.id, search)

    const lastPage = Math.ceil(count / limit) - 1

    return c.json({ result: userReports, lastPage }, SC.success.OK)
  }
)
