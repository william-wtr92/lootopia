import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

const $get = client.stats.overview.stats.$get
export type MainStatsResponse = InferResponseType<typeof $get>

export const getMainStats = async () => {
  const response = await $get()

  if (response.ok) {
    const data = await response.json()

    return data
  }

  return null
}
