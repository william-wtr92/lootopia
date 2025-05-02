import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

const $get = client["town-hall"].offers.stats.mine.$get
export type UserOfferStatsResponse = Exclude<
  InferResponseType<typeof $get>["result"],
  string
>

export const getUserOfferStats = async () => {
  const response = await $get()

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
