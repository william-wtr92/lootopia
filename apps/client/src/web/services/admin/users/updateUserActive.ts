import type { UsersUpdateActiveSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const updateUserActive = async (body: UsersUpdateActiveSchema) => {
  const response = await client.admin.users.update.$post({
    json: body,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
