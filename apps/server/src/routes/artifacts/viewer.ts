import { zValidator } from "@hono/zod-validator"
import { SC, artifactParamSchema } from "@lootopia/common"
import {
  artifactNotFound,
  selectArtifactById,
} from "@server/features/artifacts"
import { Hono } from "hono"

const app = new Hono()

export const artifactViewerRoute = app.get(
  "/viewer/:id",
  zValidator("param", artifactParamSchema),
  async (c) => {
    const id = c.req.param("id")

    const artifact = await selectArtifactById(id)

    if (!artifact) {
      return c.json(artifactNotFound, SC.errors.NOT_FOUND)
    }

    return c.json({ result: artifact }, SC.success.OK)
  }
)
