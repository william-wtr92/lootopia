import { defaultLimit, type PaymentListParamsSchema } from "@lootopia/common"
import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

const $get = client.shop.payments.$get
export type PaymentListResponse = InferResponseType<typeof $get>
export type PaymentResponse = Exclude<
  PaymentListResponse["result"][number],
  string
>

export const getUserPaymentList = async (queries: PaymentListParamsSchema) => {
  const response = await $get({
    query: {
      search: queries.search,
      limit: queries.limit?.toString() || defaultLimit.toString(),
      page: queries.page.toString(),
    },
  })

  if (response.ok) {
    const data = await response.json()

    return data
  }

  return null
}
