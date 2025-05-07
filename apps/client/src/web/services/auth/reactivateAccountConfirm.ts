import type { ReactivateAccountConfirmSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const reactivateAccountConfirm = async (
  query: ReactivateAccountConfirmSchema
) => {
  const response = await client.auth["reactivate-account"].confirm.$post({
    query,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
