import type { HuntIdSchema } from "@common/hunts"

import { client } from "@client/web/utils/client"

export const getHuntById = async (huntId: HuntIdSchema) => {
  const response = await client.hunts[":huntId"].$get({
    param: huntId,
  })

  if (response.ok) {
    const data = await response.json()

    return data
  }

  return null
}
