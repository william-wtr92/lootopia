import type { UserNicknameSchema } from "@lootopia/common"
import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

const $get = client.users.find[":nickname"].$get
export type UserStatistics = InferResponseType<typeof $get>
export type UserStatisticsResponse = Exclude<UserStatistics["result"], string>

export const getUserByNickname = async (query: UserNicknameSchema) => {
  const response = await $get({
    param: query,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
