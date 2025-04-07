import type { UserNicknameSchema } from "@common/users"

import { client } from "@client/web/utils/client"

export const getUserByNickname = async (query: UserNicknameSchema) => {
  const response = await client.users[":nickname"].$get({
    param: query,
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
