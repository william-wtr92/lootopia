import type { ArtifactParamSchema } from "@lootopia/common"
import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

const $get = client.artifacts.viewer[":id"].$get
export type ArtifactResultResponse = InferResponseType<typeof $get>
export type ArtifactResponse = Exclude<ArtifactResultResponse["result"], string>

export const getArtifactById = async (
  artifactId: ArtifactParamSchema["id"]
) => {
  const response = await $get({
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
