import type { LoginSchemaType } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const login = async (body: LoginSchemaType) => {
  const response = await client.auth.login.$post({
    form: body,
  })

  if (!response.ok) {
    const errorData = await response.json()

    return [false, errorData.errorKey || "unexpected_error"]
  }

  const data = await response.json()

  return [true, data.token]
}
