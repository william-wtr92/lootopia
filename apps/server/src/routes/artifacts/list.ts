import { zValidator } from "@hono/zod-validator"
import {
  artifactInventoryQuerySchema,
  defaultLimit,
  defaultPage,
  SC,
  type ArtifactRarity,
} from "@lootopia/common"
import {
  selectArtifactsByUserId,
  selectUserArtifact,
  selectUserArtifactCount,
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
  .get(
    "/inventory",
    zValidator("query", artifactInventoryQuerySchema),
    async (c) => {
      const email = c.get(contextKeys.loggedUserEmail)
      const {
        limit: limitString,
        page: offsetString,
        search,
        filters,
      } = c.req.query()

      const user = await selectUserByEmail(email)

      if (!user) {
        return c.json(userNotFound, SC.errors.NOT_FOUND)
      }

      const limit = parseInt(limitString, 10) || defaultLimit
      const page = parseInt(offsetString, 10) || defaultPage

      const inventory = await selectUserArtifact(
        user.id,
        limit,
        page,
        search,
        filters as ArtifactRarity
      )

      const [{ count }] = await selectUserArtifactCount(user.id)

      const lastPage = Math.ceil(count / limit) - 1

      return c.json({ result: inventory, lastPage }, SC.success.OK)
    }
  )
