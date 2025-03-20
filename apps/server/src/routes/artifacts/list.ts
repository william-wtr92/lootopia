import { SC } from "@common/index"
import { selectArtifactsByUserId } from "@server/features/artifacts"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const listArtifactsRoute = app.get("/", async (c) => {
  const email = c.get(contextKeys.loggedUserEmail)

  const user = await selectUserByEmail(email)

  if (!user) {
    return c.json(userNotFound, SC.errors.NOT_FOUND)
  }

  const artifacts = await selectArtifactsByUserId(user.id)

  return c.json(
    {
      result: artifacts,
    },
    SC.success.OK
  )
})
