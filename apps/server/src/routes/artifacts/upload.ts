import { zValidator } from "@hono/zod-validator"
import { artifactUploadSchema, SC } from "@lootopia/common"
import {
  artifactAlreadyExists,
  artifactCreated,
  insertArtifact,
  selectArtifactByShaKey,
} from "@server/features/artifacts"
import { selectUserByEmail, userNotFound } from "@server/features/users"
import { azureDirectory, uploadImage } from "@server/utils/actions/azureActions"
import { generateSHA256 } from "@server/utils/helpers/encrypt"
import { defaultMimeType, fileToBuffer } from "@server/utils/helpers/files"
import { contextKeys } from "@server/utils/keys/contextKeys"
import { Hono } from "hono"
import mime from "mime"

const app = new Hono()

export const uploadArtifactRoute = app.post(
  "/upload",
  zValidator("form", artifactUploadSchema),
  async (c) => {
    const email = c.get(contextKeys.loggedUserEmail)
    const { file: artifact } = c.req.valid("form")

    const user = await selectUserByEmail(email)

    if (!user) {
      return c.json(userNotFound, SC.errors.NOT_FOUND)
    }

    const mimeType = mime.getType(artifact.name) || defaultMimeType
    const buffer = await fileToBuffer(artifact)
    const shaKey = generateSHA256(buffer)

    if (await selectArtifactByShaKey(shaKey)) {
      return c.json(artifactAlreadyExists, SC.errors.CONFLICT)
    }

    const link = await uploadImage(azureDirectory.artifacts, artifact, mimeType)

    await insertArtifact(
      {
        name: artifact.name,
        link: link,
        shaKey: shaKey,
      },
      user.id
    )

    return c.json(artifactCreated, SC.success.CREATED)
  }
)
