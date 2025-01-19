# 💨 Azure Blob Storage

> Azure Blob Storage is Microsoft's object storage solution for the cloud. Blob storage is optimized for storing massive
> amounts of unstructured data, such as text or binary data.

## 📚 Ressources

- [📖 Documentation](https://docs.microsoft.com/en-us/azure/storage/blobs/)
- [📦 Azure Blob Storage JS SDK](https://github.com/Azure/azure-sdk-for-js)
- [📦 Azurite Emulator](https://github.com/Azure/Azurite)
- [📦 Azure Storage Explorer](https://azure.microsoft.com/fr-fr/products/storage/storage-explorer)

## ⚠️ Requirements

- Install the Azure Blob Storage SDK:

```bash
pnpm add @azure/storage-blob
```

- Install the Azurite emulator for local development:

```bash
pnpm add -D azurite
```

- Install the `concurrently` package to run multiple commands concurrently:

```bash
pnpm add -D concurrently
```

- Change the dev command in `package.json`:

```json
{
  "scripts": {
    "dev:local": "concurrently \"azurite --silent --location ./azurite --debug ./azurite/debug.log\" \"tsx watch ./src/index.ts\""
  }
}
```

- Create environment variables in a `.env` file:

```env
AZURE_ACCOUNT_NAME=devstoreaccount1
AZURE_ACCOUNT_KEY=your_account_key

AZURE_BLOB_CONTAINER=lootopia
AZURE_BLOB_CONNECTION=DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://localhost:10000/devstoreaccount1;
```

⚠️ [Help for account key here.](https://learn.microsoft.com/fr-fr/azure/storage/common/storage-use-azurite?tabs=visual-studio%2Cblob-storage#connect-to-azurite-with-sdks-and-tools)

## 💡 Examples

- Create a new Blob Storage client:

```ts
import { BlobServiceClient } from "@azure/storage-blob"

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
)
const containerClient = blobServiceClient.getContainerClient("my-container")

;(async () => {
  // Create the container if it doesn't exist
  const exists = await containerClient.exists()

  if (!exists) {
    await containerClient.create({ access: "blob" })
  }
})()

export const blobStorage = containerClient // Export the container client for further use
```

- With HonoJS, you can upload a file to the container:

```ts
app.post(
  "/upload-image",
  bodyLimit({
    maxSize: 1024 * 1024 * 1000, // default is 100Kb
    onError: (c: Context) => {
      return /* Your Error */
    },
  }),
  async (c: Context): Promise<Response> => {
    const { image } = await c.req.parseBody() // Parse the body to get the image

    if (!(image instanceof File)) {
      return /* Your Error */
    }

    const imageName = `${v4()}-${image.name}` // Generate a unique name for the image
    const mimeType = mime.getType(imageName) || defaultMimeType // Get the MIME type of the image or video

    const blobHTTPHeaders = {
      blobContentType: mimeType,
    } as const

    /* Here    `azure`  is the  container client */
    /*            |                              */
    /*            v                              */
    const blob = azure.getBlockBlobClient(imageName) // Create a new block blob client
    await blob.uploadData(await image.arrayBuffer(), {
      // Upload the image to the container
      blobHTTPHeaders,
    })

    return /* Your response */
  }
)
```
