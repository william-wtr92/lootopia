import type { HuntIdSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const requestParticipation = async (huntId: HuntIdSchema) => {
  const response = await client.hunts.participate[":huntId"].request.$post({
    param: huntId,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
