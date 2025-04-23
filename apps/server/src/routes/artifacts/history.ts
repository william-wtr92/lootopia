import { zValidator } from "@hono/zod-validator"
import {
  artifactHistoryQuerySchema,
  defaultLimit,
  defaultPage,
  SC,
  userArtifactParamSchema,
} from "@lootopia/common"
import {
  selectArtifactHistory,
  selectUserArtifactById,
  userArtifactNotFound,
} from "@server/features/artifacts"
import { Hono } from "hono"

const app = new Hono()

export const artifactHistoryRoute = app.get(
  "/history/:userArtifactId",
  zValidator("param", userArtifactParamSchema),
  zValidator("query", artifactHistoryQuerySchema),
  async (c) => {
    const userArtifactId = c.req.param("userArtifactId")
    const { limit: limitString, page: offsetString } = c.req.query()

    const userArtifact = await selectUserArtifactById(userArtifactId)

    if (!userArtifact) {
      return c.json(userArtifactNotFound, SC.errors.NOT_FOUND)
    }

    const limit = parseInt(limitString, 10) || defaultLimit
    const page = parseInt(offsetString, 10) || defaultPage

    const [history, countResult] = await selectArtifactHistory(
      limit,
      page,
      userArtifactId
    )

    const lastPage = Math.ceil(countResult / limit) - 1

    return c.json(
      {
        result: history,
        countResult,
        lastPage,
      },
      SC.success.OK
    )
  }
)
