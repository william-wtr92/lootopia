import { blobStorage } from "@server/utils/clients/azure"
import { v4 } from "uuid"

export const azureDirectory = {
  avatars: "avatars/",
  artifacts: "artifacts/",
  reports: "reports/",
  paymentExports: "payment-exports/",
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

export const uploadCSV = async (directory: AzureDirectory, csv: string) => {
  const csvName = `${directory}${v4()}.csv`

  const blobHTTPHeaders = {
    blobContentType: "text/csv",
  } as const

  const blob = blobStorage.getBlockBlobClient(csvName)
  await blob.uploadData(Buffer.from(csv), {
    blobHTTPHeaders,
  })

  return `/${csvName}`
}
