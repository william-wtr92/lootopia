import type { MfaLoginSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const mfa = async (body: MfaLoginSchema) => {
  const response = await client.auth.login.mfa.$post({
    json: body,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
