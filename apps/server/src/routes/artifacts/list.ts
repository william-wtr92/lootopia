import { SC } from "@common/index"
import {
  selectArtifactById,
  selectArtifactsByUserId,
} from "@server/features/artifacts"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"

const app = new Hono()

export const listArtifactsRoute = app
  .get("/", async (c) => {
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
  .get("/:id", async (c) => {
    const id = c.req.param("id")

    const artifact = await selectArtifactById(id)

    if (!artifact) {
      return c.json(SC.errors.NOT_FOUND, SC.errors.NOT_FOUND)
    }

    return c.json({ result: artifact }, SC.success.OK)
  })
