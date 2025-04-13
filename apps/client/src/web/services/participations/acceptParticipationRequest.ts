import type { ParticipationRequestIds } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const acceptParticipationRequest = async (
  params: ParticipationRequestIds
) => {
  const response = await client.hunts.participate[":huntId"].request[
    ":requestId"
  ].accept.$post({
    param: params,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
