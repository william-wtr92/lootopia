import type { HuntIdSchema, HuntSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const updateHunt = async (huntId: HuntIdSchema, body: HuntSchema) => {
  const response = await client.hunts.update[":huntId"].$put({
    param: huntId,
    json: body,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
