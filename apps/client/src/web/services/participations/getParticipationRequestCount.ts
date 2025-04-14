import type { HuntIdSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const getParticipationRequestCount = async (param: HuntIdSchema) => {
  const response = await client.hunts.participate[
    ":huntId"
  ].requests.count.$get({
    param,
  })

  if (response.ok) {
    const data = await response.json()

    return data.count
  }

  return 0
}
