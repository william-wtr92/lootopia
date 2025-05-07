import { SC } from "@lootopia/common"
import { selectCrownsPackages } from "@server/features/shop"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const crownPackagesRoute = app.get("/packages", async (c) => {
  const email = c.get(contextKeys.loggedUserEmail)

  const user = await selectUserByEmail(email)

  if (!user) {
    return c.json(userNotFound, SC.errors.NOT_FOUND)
  }

  const crownPackages = await selectCrownsPackages()

  return c.json(
    {
      result: crownPackages,
    },
    SC.success.OK
  )
})
