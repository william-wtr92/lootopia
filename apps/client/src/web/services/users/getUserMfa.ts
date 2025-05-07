import { client } from "@client/web/utils/client"

export const getUserMfa = async () => {
  const response = await client.users.security.mfa.enable.$get()

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
