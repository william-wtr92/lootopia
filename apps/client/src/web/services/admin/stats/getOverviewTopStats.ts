import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

const $get = client.stats.overview["top-data"].$get
export type TopStatsResponse = InferResponseType<typeof $get>
export type TopStat = Exclude<TopStatsResponse["result"], string>

export const getOverviewTopStats = async () => {
  const response = await $get()

  if (response.ok) {
    const data = await response.json()

    return data as TopStatsResponse
  }

  return null
}
