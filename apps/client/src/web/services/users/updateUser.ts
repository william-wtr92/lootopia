import type { UpdateSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

const updateUser = async (data: UpdateSchema) => {
  const response = await client.users.me.$put({
    form: data,
  })

  if (response.ok) {
    const { result } = await response.json()

    return result
  }

  return null
}

export default updateUser
