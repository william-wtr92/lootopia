import type { ArtifactParamSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const getArtifactById = async (
  artifactId: ArtifactParamSchema["id"]
) => {
  const response = await client.artifacts[":id"].$get({
    param: {
      id: artifactId,
    },
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
