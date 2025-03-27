import type { ArtifactUploadSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const uploadArtifact = async (body: ArtifactUploadSchema) => {
  const response = await client.artifacts.upload.$post({
    form: body,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
