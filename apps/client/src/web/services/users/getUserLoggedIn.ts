import { client } from "@client/web/utils/client"

export const getUserLoggedIn = async () => {
  const response = await client.users.me.$get()

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
