import { BlobServiceClient } from "@azure/storage-blob"
import appConfig from "@server/config"

const { connection, container } = appConfig.azure.blob
const blobServiceClient = BlobServiceClient.fromConnectionString(connection)
const containerClient = blobServiceClient.getContainerClient(container)

;(async () => {
  const exists = await containerClient.exists()

  if (!exists) {
    await containerClient.create({ access: "blob" })
  }
})()

export const blobStorage = containerClient
