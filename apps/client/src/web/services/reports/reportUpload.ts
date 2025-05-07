import type { ReportSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const reportUpload = async (body: ReportSchema) => {
  const response = await client.reports.$post({
    form: body,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
