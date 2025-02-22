import type { EmailValidationSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const emailChangeValidation = async (query: EmailValidationSchema) => {
  const response = await client.auth["email-change-validation"].$get({
    query,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
