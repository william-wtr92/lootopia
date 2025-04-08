import type { SessionIdSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const getSessionIdDetails = async (query: SessionIdSchema) => {
  const response = await client.shop.session[":sessionId"].$get({
    param: query,
  })

  if (response.ok) {
    const data = await response.json()

    return data
  }

  return null
}
