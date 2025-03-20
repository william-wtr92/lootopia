import type { RequestPasswordResetSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const requestPasswordReset = async (
  body: RequestPasswordResetSchema
) => {
  const response = await client.auth["request-password-reset"].$post({
    json: body,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
