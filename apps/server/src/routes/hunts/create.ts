import { zValidator } from "@hono/zod-validator"
import { combinedHuntSchema, SC } from "@lootopia/common"
import {
  huntCreatedSuccess,
  insertHuntWithChests,
} from "@server/features/hunts"
import { userNotFound, selectUserByEmail } from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const createHuntRoute = app.post(
  "/",
  zValidator("json", combinedHuntSchema),
  async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const body = c.req.valid("json")

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    insertHuntWithChests(body, user.id)

    return c.json(huntCreatedSuccess, SC.success.CREATED)
  }
)
