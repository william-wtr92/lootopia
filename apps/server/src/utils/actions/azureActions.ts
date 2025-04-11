import { blobStorage } from "@server/utils/clients/azure"
import { v4 } from "uuid"

export const azureDirectory = {
  avatars: "avatars/",
  artifacts: "artifacts/",
  reports: "reports/",
} as const

type AzureDirectory = (typeof azureDirectory)[keyof typeof azureDirectory]

export const uploadImage = async (
  directory: AzureDirectory,
  image: File,
  mimeType: string
) => {
  const imageName = `${directory}${v4()}-${image.name}`

  const blobHTTPHeaders = {
    blobContentType: mimeType,
  } as const

  const blob = blobStorage.getBlockBlobClient(imageName)
  await blob.uploadData(await image.arrayBuffer(), {
    blobHTTPHeaders,
  })

  return `/${imageName}`
}
