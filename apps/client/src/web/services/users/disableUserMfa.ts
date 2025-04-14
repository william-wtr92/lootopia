import type { MfaSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const disableUserMfa = async (body: MfaSchema) => {
  const response = await client.users.security.mfa.disable.$post({
    json: body,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
