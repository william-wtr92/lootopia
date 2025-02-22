import type { UpdateSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

type UpdateMessageKeyType =
  | "updateSuccess"
  | "updateSuccessWithEmailChange"
  | "userNotFound"
  | "nicknameAlreadyExists"
  | "phoneAlreadyExists"
  | "invalidImage"
  | "invalidExtension"
  | "waitThirtyDaysBeforeUpdatingNickname"
  | null

type SuccessMessageKeyType = Extract<
  UpdateMessageKeyType,
  "updateSuccess" | "updateSuccessWithEmailChange" | null
>

const updateUser = async (
  data: UpdateSchema
): Promise<[SuccessMessageKeyType, UpdateMessageKeyType]> => {
  const response = await client.users.me.$put({
    form: data,
  })

  if (response.ok) {
    const { key } = await response.json()

    return [key, null]
  }

  return [null, (await response.json()).key]
}

export default updateUser
