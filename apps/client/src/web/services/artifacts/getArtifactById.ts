import { client } from "@client/web/utils/client"

export const getArtifactById = async (artifactId: string) => {
  const response = await client.artifacts[":id"].$get({
    param: {
      id: artifactId,
    },
  })

  if (response.status) {
    const data = await response.json()

    return data.result
  }

  return null
}
