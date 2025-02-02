import type { LoginSchemaType } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const login = async (body: LoginSchemaType) => {
  const response = await client.auth.login.$post({
    form: body,
  })

  const data = await response.json()

  if (!response.ok) {
    const errorData = data as { errorKey: string }

    return [false, errorData.errorKey || "unexpected_error"]
  }

  const successData = data as { message: { result: string; key: string } }

  return [true, successData.message.key]
}
