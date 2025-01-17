import { SC } from "@lootopia/common"
import { invalidExtension, invalidImage } from "@server/features/users"
import { blobStorage } from "@server/utils/clients/azure"
import { defaultMimeType } from "@server/utils/helpers/files"
import type { Context } from "hono"
import mime from "mime"
import { v4 } from "uuid"

export const uploadImage = async (c: Context, image: File) => {
  if (!(image instanceof File)) {
    return c.json(invalidImage, SC.errors.BAD_REQUEST)
  }

  const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"]
  const mimeType = mime.getType(image.name) || defaultMimeType

  if (!allowedMimeTypes.includes(mimeType)) {
    return c.json(invalidExtension, SC.errors.BAD_REQUEST)
  }

  const imageName = `${v4()}-${image.name}`

  const blobHTTPHeaders = {
    blobContentType: mimeType,
  } as const

  const blob = blobStorage.getBlockBlobClient(imageName)
  await blob.uploadData(await image.arrayBuffer(), {
    blobHTTPHeaders,
  })

  return `/${imageName}`
}
