import type { PasswordResetSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const passwordReset = async (body: PasswordResetSchema) => {
  const response = await client.auth["reset-password"].$post({
    json: body,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
