import { defaultLimit, type ReportListParamsSchema } from "@lootopia/common"
import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

const $get = client.reports.$get
export type ReportListResponse = InferResponseType<typeof $get>
export type ReportResponse = Exclude<
  ReportListResponse["result"][number],
  string
>

export const getUserReportList = async (queries: ReportListParamsSchema) => {
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
