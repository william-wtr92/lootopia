import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

const $get = client["town-hall"].offers.stats.weekly.$get
export type WeeklyOfferStatsResponse = Exclude<
  InferResponseType<typeof $get>["result"],
  string
>

export const getWeeklyOfferStats = async () => {
  const response = await $get()

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
