import type { LoginSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const login = async (body: LoginSchema) => {
  const response = await client.auth.login.$post({
    json: body,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
