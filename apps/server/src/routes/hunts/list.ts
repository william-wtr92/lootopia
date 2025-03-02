import {
  selectHunts,
  selectHuntsCount,
} from "@server/features/hunts/repository/select"
import { Hono } from "hono"

const app = new Hono()

export const listHuntRoute = app.get("/", async (c) => {
  const { limit: limitString, page: offsetString, name, city } = c.req.query()

  const limit = parseInt(limitString, 10) || 10
  const page = parseInt(offsetString, 10) || 0

  const hunts = await selectHunts(limit, page, name, city)

  const [{ count }] = await selectHuntsCount(name, city)

  const lastPage = Math.ceil(count / limit) - 1

  return c.json({ result: hunts, lastPage })
})
