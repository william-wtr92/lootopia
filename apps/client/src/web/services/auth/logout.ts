import { client } from "@client/web/utils/client"

export const logout = async () => {
  const response = await client.auth.logout.$post()

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
