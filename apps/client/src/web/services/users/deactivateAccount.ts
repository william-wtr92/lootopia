import { client } from "@client/web/utils/client"

export const deactivateAccount = async () => {
  const response = await client.users["deactivate-account"].$post()

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
