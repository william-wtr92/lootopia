import type { ResendEmailValidationSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const resendEmailValidation = async (
  body: ResendEmailValidationSchema
) => {
  const response = await client.auth["resend-email-validation"].$post({
    json: body,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
