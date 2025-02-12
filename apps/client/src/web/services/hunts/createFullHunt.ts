import type { CombinedHuntSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const createFullHunt = async (body: CombinedHuntSchema) => {
  const response = await client.hunts.$post({
    json: body,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
