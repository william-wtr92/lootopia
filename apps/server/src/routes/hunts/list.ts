import { zValidator } from "@hono/zod-validator"
import {
  defaultLimit,
  defaultPage,
  huntListQuerySchema,
  huntMineListQuerySchema,
  SC,
} from "@lootopia/common"
import {
  selectHunts,
  selectHuntsCount,
  selectOrganizerHuntsCount,
} from "@server/features/hunts"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const listHuntRoute = app
  .get("/", zValidator("query", huntListQuerySchema), async (c) => {
    const { limit: limitString, page: offsetString, name, city } = c.req.query()

    const limit = parseInt(limitString, 10) || defaultLimit
    const page = parseInt(offsetString, 10) || defaultPage

    const hunts = await selectHunts({
      page,
      limit,
      filters: {
        name,
        city,
      },
    })

    const [{ count }] = await selectHuntsCount(name, city)

    const lastPage = Math.ceil(count / limit) - 1

    return c.json({ result: hunts, lastPage })
  })
  .get("/mine", zValidator("query", huntMineListQuerySchema), async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const { search, limit: limitString, page: offsetString } = c.req.query()

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const limit = parseInt(limitString, 10) || defaultLimit
    const page = parseInt(offsetString, 10) || defaultPage

    const hunts = await selectHunts({
      limit,
      page,
      filters: { search, organizerId: user.id },
    })

    const [{ count }] = await selectOrganizerHuntsCount(user.id)

    const lastPage = Math.ceil(count / limit) - 1

    return c.json({ result: hunts, lastPage })
  })
