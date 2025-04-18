import type { HuntIdSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const participate = async (query: HuntIdSchema) => {
  const response = await client.hunts.participate[":huntId"].$post({
    param: query,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
