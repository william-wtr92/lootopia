import { client } from "@client/web/utils/client"

export const getArtifacts = async () => {
  const response = await client.artifacts.$get()

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
