import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_URL: z.string().min(1),
    NEXT_PUBLIC_MIDDLEWARE_API_URL: z.string().min(1),
    NEXT_PUBLIC_AZURE_BLOB_URL: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_MIDDLEWARE_API_URL: process.env.NEXT_PUBLIC_MIDDLEWARE_API_URL,
    NEXT_PUBLIC_AZURE_BLOB_URL: process.env.NEXT_PUBLIC_AZURE_BLOB_URL,
  },
})

export const config = {
  blobUrl: env.NEXT_PUBLIC_AZURE_BLOB_URL,
}
