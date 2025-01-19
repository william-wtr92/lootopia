import { blobStorage } from "@server/utils/clients/azure"
import { v4 } from "uuid"

export const uploadImage = async (image: File, mimeType: string) => {
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
