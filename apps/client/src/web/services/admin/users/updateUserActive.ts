import { client } from "@client/web/utils/client"

export const updateUserActive = async (email: string) => {
  const response = await client.admin.users.update.$post({
    json: {
      email,
    },
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
