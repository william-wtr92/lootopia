import type { ReactivateAccountRequestSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const reactivateAccountRequest = async (
  body: ReactivateAccountRequestSchema
) => {
  const response = await client.auth["reactivate-account"].request.$post({
    json: body,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
